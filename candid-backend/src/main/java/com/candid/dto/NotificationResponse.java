package com.candid.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    private Long id;
    private UserResponse actor;
    private String type;
    private Long postId;
    private boolean isRead;
    private String message;
    private Instant createdAt;
}
