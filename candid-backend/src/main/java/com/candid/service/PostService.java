package com.candid.service;

import com.candid.dto.PostResponse;
import com.candid.entity.*;
import com.candid.repository.*;
import com.cloudinary.Cloudinary;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final FollowRepository followRepository;
    private final LikeRepository likeRepository;
    private final BookmarkRepository bookmarkRepository;
    private final CommentRepository commentRepository;
    private final HashtagRepository hashtagRepository;
    private final NotificationRepository notificationRepository;
    private final ReportRepository reportRepository;
    private final Cloudinary cloudinary;
    private final UserService userService;
    private final RankingService rankingService;

    /** Number of recent posts pulled into the ranking pool */
    private static final int POOL_SIZE = 300;

    // ── Batch-fetch helpers (avoid N+1 queries) ───────────────────────────────
    private Map<Long, Long> batchLikeCounts(List<Post> posts) {
        Map<Long, Long> map = new HashMap<>();
        if (posts.isEmpty()) return map;
        likeRepository.countsByPosts(posts)
            .forEach(row -> map.put((Long) row[0], (Long) row[1]));
        return map;
    }

    private Map<Long, Long> batchCommentCounts(List<Post> posts) {
        Map<Long, Long> map = new HashMap<>();
        if (posts.isEmpty()) return map;
        commentRepository.countsByPosts(posts)
            .forEach(row -> map.put((Long) row[0], (Long) row[1]));
        return map;
    }

    private Set<Long> batchLikedIds(User user, List<Post> posts) {
        if (user == null || posts.isEmpty()) return Collections.emptySet();
        return new HashSet<>(likeRepository.likedPostIds(user, posts));
    }

    private Set<Long> batchBookmarkedIds(User user, List<Post> posts) {
        if (user == null || posts.isEmpty()) return Collections.emptySet();
        return new HashSet<>(bookmarkRepository.bookmarkedPostIds(user, posts));
    }

    private double computeScore(long likes, long comments, LocalDateTime createdAt) {
        long hoursOld = ChronoUnit.HOURS.between(createdAt, LocalDateTime.now());
        return (likes * 2.0 + comments * 3.0) / Math.pow(hoursOld + 2, 1.5);
    }

    // ── Core ranking + pagination ─────────────────────────────────────────────
    /**
     * Scores, sorts, applies optional diversity cap, then paginates a pool of posts.
     */
    private Page<PostResponse> rankAndPage(List<Post> pool, User currentUser, Pageable pageable, int maxPerUser,
                                         Map<Long, Integer> affinity, Set<String> interests, Set<Long> socialSignals) {
        if (pool.isEmpty()) return new PageImpl<>(Collections.emptyList(), pageable, 0);

        Map<Long, Long> likeCounts    = batchLikeCounts(pool);
        Map<Long, Long> commentCounts = batchCommentCounts(pool);
        Set<Long> likedIds      = batchLikedIds(currentUser, pool);
        Set<Long> bookmarkedIds = batchBookmarkedIds(currentUser, pool);

        List<Post> ranked = pool.stream()
            .sorted(Comparator.comparingDouble((Post p) -> {
                double score = computeScore(
                    likeCounts.getOrDefault(p.getId(), 0L),
                    commentCounts.getOrDefault(p.getId(), 0L),
                    p.getCreatedAt()
                );
                if (affinity != null && affinity.containsKey(p.getUser().getId())) {
                    score *= (1.0 + (affinity.get(p.getUser().getId()) / 10.0));
                }
                if (socialSignals != null && socialSignals.contains(p.getId())) {
                    score *= 1.3;
                }
                if (interests != null && !interests.isEmpty()) {
                    boolean hasInterest = p.getHashtags().stream()
                        .anyMatch(h -> interests.contains(h.getName().toLowerCase()));
                    if (hasInterest) score *= 1.5;
                }
                return score;
            }).reversed())
            .collect(Collectors.toList());

        // Diversity filter
        Map<Long, Integer> authorCount = new HashMap<>();
        List<Post> diverse = new ArrayList<>();
        for (Post p : ranked) {
            Long authorId = p.getUser().getId();
            int cnt = authorCount.getOrDefault(authorId, 0);
            if (cnt < maxPerUser) {
                diverse.add(p);
                authorCount.put(authorId, cnt + 1);
            }
        }

        int start = (int) pageable.getOffset();
        int end   = Math.min(start + pageable.getPageSize(), diverse.size());
        if (start >= diverse.size()) {
            return new PageImpl<>(Collections.emptyList(), pageable, diverse.size());
        }

        List<PostResponse> responses = diverse.subList(start, end).stream().map(p -> {
            PostResponse r = mapToResponse(p, currentUser);
            r.setLikesCount(likeCounts.getOrDefault(p.getId(), 0L));
            r.setCommentsCount(commentCounts.getOrDefault(p.getId(), 0L));
            r.setLiked(likedIds.contains(p.getId()));
            r.setBookmarked(bookmarkedIds.contains(p.getId()));
            return r;
        }).collect(Collectors.toList());

        return new PageImpl<>(responses, pageable, diverse.size());
    }

    // ── Public API ────────────────────────────────────────────────────────────

    @Transactional
    public PostResponse createPost(String email, String content, String mood, List<MultipartFile> images) throws IOException {
        User user = userService.getUserEntityByEmail(email);

        Post post = new Post();
        post.setUser(user);
        post.setContent(content != null ? content : "");
        post.setMood(mood);

        if (images != null) {
            for (MultipartFile image : images) {
                if (image != null && !image.isEmpty()) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> uploadResult = cloudinary.uploader().upload(image.getBytes(),
                            Map.of("folder", "candid/posts"));
                    post.getImageUrls().add((String) uploadResult.get("secure_url"));
                }
            }
        }

        List<Hashtag> hashtags = extractAndSaveHashtags(content != null ? content : "");
        post.setHashtags(hashtags);

        postRepository.save(post);
        return mapToResponse(post, user);
    }

    /**
     * Home feed: posts from people you follow + your own, newest first.
     */
    public Page<PostResponse> getFeed(String email, Pageable pageable) {
        User currentUser = userService.getUserEntityByEmail(email);
        List<User> following = followRepository.findByFollower(currentUser)
                .stream().map(Follow::getFollowing).collect(Collectors.toList());
        List<User> feedUsers = new ArrayList<>(following);
        feedUsers.add(currentUser);

        Page<Post> page = postRepository.findFeedPosts(feedUsers, pageable);
        List<Post> posts = page.getContent();

        Map<Long, Long> likeCounts    = batchLikeCounts(posts);
        Map<Long, Long> commentCounts = batchCommentCounts(posts);
        Set<Long> likedIds      = batchLikedIds(currentUser, posts);
        Set<Long> bookmarkedIds = batchBookmarkedIds(currentUser, posts);

        List<PostResponse> responses = posts.stream().map(p -> {
            PostResponse r = mapToResponse(p, currentUser);
            r.setLikesCount(likeCounts.getOrDefault(p.getId(), 0L));
            r.setCommentsCount(commentCounts.getOrDefault(p.getId(), 0L));
            r.setLiked(likedIds.contains(p.getId()));
            r.setBookmarked(bookmarkedIds.contains(p.getId()));
            return r;
        }).collect(Collectors.toList());

        return new PageImpl<>(responses, pageable, page.getTotalElements());
    }

    /**
     * Discover feed: posts from people you don't follow (excludes self too).
     * Diversity cap of 3 posts per author keeps the feed varied.
     */
    public Page<PostResponse> getDiscover(String email, Pageable pageable) {
        User currentUser = userService.getUserEntityByEmail(email);
        Set<String> interests = rankingService.getUserInterests(currentUser);
        Set<Long> socialSignals = rankingService.getSocialSignals(currentUser);

        List<Post> pool = postRepository.findDiscoverPool(currentUser, PageRequest.of(0, POOL_SIZE));
        return rankAndPage(pool, currentUser, pageable, 3, null, interests, socialSignals);
    }

    /**
     * Public feed for guests (no auth), newest first.
     */
    public Page<PostResponse> getPublicFeed(Pageable pageable) {
        Page<Post> page = postRepository.findPublicFeed(pageable);
        List<Post> posts = page.getContent();

        Map<Long, Long> likeCounts    = batchLikeCounts(posts);
        Map<Long, Long> commentCounts = batchCommentCounts(posts);

        List<PostResponse> responses = posts.stream().map(p -> {
            PostResponse r = mapToResponse(p, null);
            r.setLikesCount(likeCounts.getOrDefault(p.getId(), 0L));
            r.setCommentsCount(commentCounts.getOrDefault(p.getId(), 0L));
            return r;
        }).collect(Collectors.toList());

        return new PageImpl<>(responses, pageable, page.getTotalElements());
    }

    public List<PostResponse> getUserPosts(String username, String currentEmail) {
        User targetUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Private profile: guests see nothing; non-followers see nothing
        if (targetUser.isPrivate()) {
            if (currentEmail == null) return Collections.emptyList();
            User currentUser = userService.getUserEntityByEmail(currentEmail);
            if (!currentUser.getId().equals(targetUser.getId()) &&
                    !followRepository.existsByFollowerAndFollowing(currentUser, targetUser)) {
                return Collections.emptyList();
            }
            return postRepository.findByUserOrderByCreatedAtDesc(targetUser)
                    .stream().map(p -> mapToResponse(p, currentUser)).collect(Collectors.toList());
        }

        User currentUser = currentEmail != null ? userService.getUserEntityByEmail(currentEmail) : null;
        return postRepository.findByUserOrderByCreatedAtDesc(targetUser)
                .stream().map(p -> mapToResponse(p, currentUser)).collect(Collectors.toList());
    }

    public PostResponse getPostById(Long id, String email) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        User currentUser = userService.getUserEntityByEmail(email);
        return mapToResponse(post, currentUser);
    }

    @Transactional
    public void deletePost(Long id, String email) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        User user = userService.getUserEntityByEmail(email);
        if (!post.getUser().getId().equals(user.getId()) && user.getRole() != User.Role.ADMIN) {
            throw new RuntimeException("Not authorized");
        }
        notificationRepository.deleteByPost(post);
        reportRepository.deleteByPost(post);
        likeRepository.deleteByPost(post);
        bookmarkRepository.deleteByPost(post);
        commentRepository.deleteByPost(post);
        postRepository.delete(post);
    }

    @Transactional
    public void adminDeletePost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        notificationRepository.deleteByPost(post);
        reportRepository.deleteByPost(post);
        likeRepository.deleteByPost(post);
        bookmarkRepository.deleteByPost(post);
        commentRepository.deleteByPost(post);
        postRepository.delete(post);
    }

    public Page<PostResponse> searchPosts(String query, String email, Pageable pageable) {
        User currentUser = userService.getUserEntityByEmail(email);
        Page<Post> posts = postRepository.findByContentContainingIgnoreCase(query, pageable);
        
        List<PostResponse> filteredResponses = posts.getContent().stream()
                .filter(p -> {
                    User author = p.getUser();
                    if (!author.isPrivate()) return true;
                    if (currentUser != null && author.getId().equals(currentUser.getId())) return true;
                    if (currentUser == null) return false;
                    return followRepository.existsByFollowerAndFollowing(currentUser, author);
                })
                .map(p -> mapToResponse(p, currentUser))
                .collect(Collectors.toList());

        return new PageImpl<>(filteredResponses, pageable, posts.getTotalElements());
    }

    public Page<PostResponse> getPostsByHashtag(String tag, String email, Pageable pageable) {
        User currentUser = email != null ? userService.getUserEntityByEmail(email) : null;
        Page<Post> posts = postRepository.findByHashtag(tag.toLowerCase(), pageable);
        List<PostResponse> responses = posts.getContent().stream()
                .map(p -> mapToResponse(p, currentUser))
                .collect(Collectors.toList());
        return new PageImpl<>(responses, pageable, posts.getTotalElements());
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private List<Hashtag> extractAndSaveHashtags(String content) {
        List<Hashtag> hashtags = new ArrayList<>();
        Pattern pattern = Pattern.compile("#(\\w+)");
        Matcher matcher = pattern.matcher(content);
        while (matcher.find()) {
            String name = matcher.group(1).toLowerCase();
            Hashtag hashtag = hashtagRepository.findByName(name)
                    .orElseGet(() -> hashtagRepository.save(new Hashtag(null, name, false)));
            if (!hashtags.contains(hashtag)) hashtags.add(hashtag);
        }
        return hashtags;
    }

    public PostResponse mapToResponse(Post post, User currentUser) {
        PostResponse response = new PostResponse();
        response.setId(post.getId());
        response.setUser(userService.mapToResponse(post.getUser(), currentUser));
        response.setContent(post.getContent());
        response.setImageUrls(post.getImageUrls());
        response.setMood(post.getMood());
        response.setCreatedAt(post.getCreatedAt().atZone(java.time.ZoneId.systemDefault()).toInstant());
        response.setLikesCount(likeRepository.countByPost(post));
        response.setCommentsCount(commentRepository.countByPost(post));
        response.setLiked(currentUser != null && likeRepository.existsByUserAndPost(currentUser, post));
        response.setBookmarked(currentUser != null && bookmarkRepository.existsByUserAndPost(currentUser, post));
        response.setHashtags(post.getHashtags().stream().map(Hashtag::getName).collect(Collectors.toList()));
        return response;
    }

}
