package com.candid.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminStatsResponse {
    private long totalUsers;
    private long totalPosts;
    private long postsToday;
    private long pendingReports;
}
