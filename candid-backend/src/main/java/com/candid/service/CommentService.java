package com.candid.service;

import com.candid.dto.CommentResponse;
import com.candid.entity.Comment;
import com.candid.entity.Notification;
import com.candid.entity.Post;
import com.candid.entity.User;
import com.candid.repository.CommentRepository;
import com.candid.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserService userService;
    private final NotificationService notificationService;

    @Transactional
    public CommentResponse addComment(String email, Long postId, String content, Long parentId) {
        User user = userService.getUserEntityByEmail(email);
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Comment comment = new Comment();
        comment.setUser(user);
        comment.setPost(post);
        comment.setContent(content);

        if (parentId != null) {
            Comment parent = commentRepository.findById(parentId)
                    .orElseThrow(() -> new RuntimeException("Parent comment not found"));
            comment.setParent(parent);
        }

        commentRepository.save(comment);

        // Notify post owner (only for top-level comments, not replies)
        if (parentId == null && !post.getUser().getId().equals(user.getId())) {
            notificationService.create(post.getUser(), user, Notification.Type.COMMENT, post, null);
        }

        return mapToResponse(comment, user);
    }

    public List<CommentResponse> getComments(Long postId, String email) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        User currentUser = userService.getUserEntityByEmail(email);

        // Return only top-level comments; replies are nested inside
        return commentRepository.findByPostAndParentIsNullOrderByCreatedAtAsc(post).stream()
                .map(c -> mapToResponse(c, currentUser))
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteComment(Long commentId, String email) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        User user = userService.getUserEntityByEmail(email);
        if (!comment.getUser().getId().equals(user.getId()) && user.getRole() != User.Role.ADMIN) {
            throw new RuntimeException("Not authorized");
        }
        // Delete replies first to satisfy FK constraint
        commentRepository.deleteByParent(comment);
        commentRepository.delete(comment);
    }

    private CommentResponse mapToResponse(Comment comment, User currentUser) {
        List<CommentResponse> replies = commentRepository
                .findByParentOrderByCreatedAtAsc(comment)
                .stream()
                .map(r -> mapToResponse(r, currentUser))
                .collect(Collectors.toList());

        return new CommentResponse(
                comment.getId(),
                userService.mapToResponse(comment.getUser(), currentUser),
                comment.getContent(),
                comment.getCreatedAt().atZone(java.time.ZoneId.systemDefault()).toInstant(),
                replies
        );
    }
}
