package com.candid.service;

import com.candid.entity.Like;
import com.candid.entity.Notification;
import com.candid.entity.Post;
import com.candid.entity.User;
import com.candid.repository.LikeRepository;
import com.candid.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository likeRepository;
    private final PostRepository postRepository;
    private final UserService userService;
    private final NotificationService notificationService;

    @Transactional
    public void like(String email, Long postId) {
        User user = userService.getUserEntityByEmail(email);
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!likeRepository.existsByUserAndPost(user, post)) {
            Like like = new Like();
            like.setUser(user);
            like.setPost(post);
            likeRepository.save(like);

            if (!post.getUser().getId().equals(user.getId())) {
                notificationService.create(post.getUser(), user, Notification.Type.LIKE, post, null);
            }
        }
    }

    @Transactional
    public void unlike(String email, Long postId) {
        User user = userService.getUserEntityByEmail(email);
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        likeRepository.deleteByUserAndPost(user, post);
    }
}
