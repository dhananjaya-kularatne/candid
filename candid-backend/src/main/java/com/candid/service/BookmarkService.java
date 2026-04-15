package com.candid.service;

import com.candid.dto.PostResponse;
import com.candid.entity.Bookmark;
import com.candid.entity.Post;
import com.candid.entity.User;
import com.candid.repository.BookmarkRepository;
import com.candid.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;
    private final PostRepository postRepository;
    private final UserService userService;
    private final PostService postService;

    @Transactional
    public void bookmark(String email, Long postId) {
        User user = userService.getUserEntityByEmail(email);
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        if (!bookmarkRepository.existsByUserAndPost(user, post)) {
            Bookmark bookmark = new Bookmark();
            bookmark.setUser(user);
            bookmark.setPost(post);
            bookmarkRepository.save(bookmark);
        }
    }

    @Transactional
    public void removeBookmark(String email, Long postId) {
        User user = userService.getUserEntityByEmail(email);
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        bookmarkRepository.deleteByUserAndPost(user, post);
    }

    public List<PostResponse> getBookmarks(String email) {
        User user = userService.getUserEntityByEmail(email);
        return bookmarkRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(b -> postService.mapToResponse(b.getPost(), user))
                .collect(Collectors.toList());
    }
}
