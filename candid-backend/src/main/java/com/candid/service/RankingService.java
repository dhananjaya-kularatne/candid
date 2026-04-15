package com.candid.service;

import com.candid.entity.User;
import com.candid.repository.BookmarkRepository;
import com.candid.repository.CommentRepository;
import com.candid.repository.LikeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RankingService {

    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;
    private final BookmarkRepository bookmarkRepository;

    /**
     * Calculates user affinity for authors.
     * Weights: Likes=2, Comments=3, Bookmarks=5.
     */
    public Map<Long, Integer> getUserAffinity(User user) {
        if (user == null) return Collections.emptyMap();
        Map<Long, Integer> affinity = new HashMap<>();

        // Collect Likes affinity
        likeRepository.countLikesByAuthor(user).forEach(row -> 
            affinity.merge((Long) row[0], ((Long) row[1]).intValue() * 2, Integer::sum));

        // Collect Comments affinity
        commentRepository.countCommentsByAuthor(user).forEach(row -> 
            affinity.merge((Long) row[0], ((Long) row[1]).intValue() * 3, Integer::sum));

        // Collect Bookmarks affinity
        bookmarkRepository.countBookmarksByAuthor(user).forEach(row -> 
            affinity.merge((Long) row[0], ((Long) row[1]).intValue() * 5, Integer::sum));

        return affinity;
    }

    /**
     * Calculates hashtag interests based on user interaction (bookmarks).
     */
    public Set<String> getUserInterests(User user) {
        if (user == null) return Collections.emptySet();
        return bookmarkRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .flatMap(b -> b.getPost().getHashtags().stream())
                .map(h -> h.getName().toLowerCase())
                .collect(Collectors.toSet());
    }

    /**
     * Finds post IDs liked by the specific followers.
     */
    public Set<Long> getSocialSignals(User user) {
        if (user == null) return Collections.emptySet();
        return new HashSet<>(likeRepository.findPostIdsLikedByFollowing(user));
    }
}
