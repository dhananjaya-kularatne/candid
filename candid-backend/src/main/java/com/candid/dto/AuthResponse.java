package com.candid.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String name;
    private String username;
    private String email;
    private String role;
    private String avatarUrl;

    public AuthResponse(String token, Long id, String name, String username, String email, String role, String avatarUrl) {
        this.token = token;
        this.id = id;
        this.name = name;
        this.username = username;
        this.email = email;
        this.role = role;
        this.avatarUrl = avatarUrl;
    }
}
