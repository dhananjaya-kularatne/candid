package com.candid.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HashtagResponse {
    private Long id;
    private String name;
    private long postCount;
    private boolean trending;
}
