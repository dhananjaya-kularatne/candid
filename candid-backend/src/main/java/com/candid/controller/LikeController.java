package com.candid.controller;

import com.candid.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;

    @PostMapping("/{id}/like")
    public ResponseEntity<Void> like(@PathVariable Long id,
                                      @AuthenticationPrincipal UserDetails userDetails) {
        likeService.like(userDetails.getUsername(), id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/like")
    public ResponseEntity<Void> unlike(@PathVariable Long id,
                                        @AuthenticationPrincipal UserDetails userDetails) {
        likeService.unlike(userDetails.getUsername(), id);
        return ResponseEntity.ok().build();
    }
}
