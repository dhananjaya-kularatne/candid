package com.candid.controller;

import com.candid.dto.HashtagResponse;
import com.candid.entity.Hashtag;
import com.candid.repository.HashtagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/hashtags")
@RequiredArgsConstructor
public class HashtagController {

    private final HashtagRepository hashtagRepository;

    /**
     * Returns the top trending hashtags based on post frequency in the last 24 hours.
     * Falls back to all-time top hashtags if fewer than 5 results exist for today.
     * Public endpoint — no authentication required.
     */
    @GetMapping("/trending")
    public ResponseEntity<List<HashtagResponse>> getTrending() {
        PageRequest top10 = PageRequest.of(0, 10);
        LocalDateTime since = LocalDateTime.now().minusHours(24);

        List<Object[]> rows = hashtagRepository.findTopSince(since, top10);

        // Fall back to all-time top if today's data is sparse
        if (rows.size() < 5) {
            rows = hashtagRepository.findTopAllTime(top10);
        }

        List<HashtagResponse> result = rows.stream().map(row -> {
            Hashtag h = (Hashtag) row[0];
            long count = (Long) row[1];
            return new HashtagResponse(h.getId(), h.getName(), count, h.isTrending());
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }
}
