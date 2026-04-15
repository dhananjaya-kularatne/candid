package com.candid.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String name;
    private String username;
    private String email;
    private String bio;
    private String avatarUrl;
    private String bannerUrl;
    private String role;
    private String status;
    private Instant createdAt;
    private long followersCount;
    private long followingCount;
    private long postsCount;
    private boolean isFollowing;
    private boolean privateProfile;
    private boolean followRequestSent;
}
