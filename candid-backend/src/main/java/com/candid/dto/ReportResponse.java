package com.candid.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReportResponse {
    private Long id;
    private UserResponse reporter;
    private PostResponse post;
    private String reason;
    private String status;
    private Instant createdAt;
}
