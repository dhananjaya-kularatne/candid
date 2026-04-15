package com.candid.service;

import com.candid.dto.NotificationResponse;
import com.candid.entity.Notification;
import com.candid.entity.Post;
import com.candid.entity.User;
import com.candid.repository.NotificationRepository;
import com.candid.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    @Transactional
    public void deleteExisting(User recipient, User actor, Notification.Type type) {
        notificationRepository.deleteByUserAndActorAndType(recipient.getId(), actor.getId(), type);
    }

    public void create(User recipient, User actor, Notification.Type type, Post post, String message) {
        Notification notification = new Notification();
        notification.setUser(recipient);
        notification.setActor(actor);
        notification.setType(type);
        notification.setPost(post);
        notification.setMessage(message);
        notificationRepository.save(notification);
    }

    public Page<NotificationResponse> getNotifications(String email, Pageable pageable) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Page<Notification> page = notificationRepository.findByUserOrderByCreatedAtDesc(user, pageable);
        List<NotificationResponse> responses = page.getContent().stream()
                .map(n -> mapToResponse(n, user))
                .collect(Collectors.toList());
        return new PageImpl<>(responses, pageable, page.getTotalElements());
    }

    public long getUnreadCount(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return notificationRepository.countByUserAndIsReadFalse(user);
    }

    @Transactional
    public void markAllRead(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        notificationRepository.markAllAsRead(user);
    }

    public void sendAnnouncement(String title, String message) {
        List<User> allUsers = userRepository.findAll();
        for (User user : allUsers) {
            Notification notification = new Notification();
            notification.setUser(user);
            notification.setType(Notification.Type.ANNOUNCEMENT);
            notification.setMessage(title + ": " + message);
            notificationRepository.save(notification);
        }
    }

    private NotificationResponse mapToResponse(Notification n, User currentUser) {
        NotificationResponse response = new NotificationResponse();
        response.setId(n.getId());
        response.setType(n.getType().name());
        response.setRead(n.isRead());
        response.setMessage(n.getMessage());
        response.setCreatedAt(n.getCreatedAt().atZone(java.time.ZoneId.systemDefault()).toInstant());
        if (n.getActor() != null) {
            response.setActor(userService.mapToResponse(n.getActor(), currentUser));
        }
        if (n.getPost() != null) {
            response.setPostId(n.getPost().getId());
        }
        return response;
    }
}
