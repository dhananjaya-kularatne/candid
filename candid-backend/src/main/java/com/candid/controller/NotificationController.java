package com.candid.controller;

import com.candid.dto.NotificationResponse;
import com.candid.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<Page<NotificationResponse>> getNotifications(
            @RequestParam(defaultValue = "0") int page,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(notificationService.getNotifications(
                userDetails.getUsername(), PageRequest.of(page, 20)));
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(@AuthenticationPrincipal UserDetails userDetails) {
        long count = notificationService.getUnreadCount(userDetails.getUsername());
        return ResponseEntity.ok(Map.of("count", count));
    }

    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllRead(@AuthenticationPrincipal UserDetails userDetails) {
        notificationService.markAllRead(userDetails.getUsername());
        return ResponseEntity.ok().build();
    }
}
