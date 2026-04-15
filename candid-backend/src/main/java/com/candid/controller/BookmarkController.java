package com.candid.controller;

import com.candid.dto.PostResponse;
import com.candid.service.BookmarkService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookmarks")
@RequiredArgsConstructor
public class BookmarkController {

    private final BookmarkService bookmarkService;

    @PostMapping("/{postId}")
    public ResponseEntity<Void> bookmark(@PathVariable Long postId,
                                          @AuthenticationPrincipal UserDetails userDetails) {
        bookmarkService.bookmark(userDetails.getUsername(), postId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> removeBookmark(@PathVariable Long postId,
                                                @AuthenticationPrincipal UserDetails userDetails) {
        bookmarkService.removeBookmark(userDetails.getUsername(), postId);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<PostResponse>> getBookmarks(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(bookmarkService.getBookmarks(userDetails.getUsername()));
    }
}
