package com.candid.controller;

import com.candid.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @GetMapping
    public ResponseEntity<SearchService.SearchResult> search(
            @RequestParam String q,
            @AuthenticationPrincipal UserDetails userDetails) {
        String email = (userDetails != null) ? userDetails.getUsername() : null;
        return ResponseEntity.ok(searchService.search(q, email));
    }
}
