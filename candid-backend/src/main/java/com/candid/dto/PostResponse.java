package com.candid.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostResponse {
    private Long id;
    private UserResponse user;
    private String content;
    private List<String> imageUrls;
    private String mood;
    private Instant createdAt;
    private long likesCount;
    private long commentsCount;
    private boolean isLiked;
    private boolean isBookmarked;
    private List<String> hashtags;
}
