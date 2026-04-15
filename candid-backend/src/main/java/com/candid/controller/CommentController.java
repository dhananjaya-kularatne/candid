package com.candid.controller;

import com.candid.dto.CommentResponse;
import com.candid.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/api/posts/{id}/comments")
    public ResponseEntity<CommentResponse> addComment(@PathVariable Long id,
                                                       @RequestBody Map<String, String> body,
                                                       @AuthenticationPrincipal UserDetails userDetails) {
        Long parentId = body.containsKey("parentId") ? Long.parseLong(body.get("parentId")) : null;
        return ResponseEntity.ok(commentService.addComment(userDetails.getUsername(), id, body.get("content"), parentId));
    }

    @GetMapping("/api/posts/{id}/comments")
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable Long id,
                                                              @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(commentService.getComments(id, userDetails.getUsername()));
    }

    @DeleteMapping("/api/comments/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id,
                                               @AuthenticationPrincipal UserDetails userDetails) {
        commentService.deleteComment(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
