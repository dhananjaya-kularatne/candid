package com.candid.controller;

import com.candid.dto.PostResponse;
import com.candid.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import jakarta.validation.constraints.NotBlank;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Validated
@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping
    public ResponseEntity<PostResponse> createPost(
            @NotBlank @RequestParam String content,
            @RequestParam(required = false) String mood,
            @RequestParam(required = false) List<MultipartFile> images,
            @AuthenticationPrincipal UserDetails userDetails) throws IOException {
        return ResponseEntity.ok(postService.createPost(userDetails.getUsername(), content, mood, images));
    }

    @GetMapping("/public")
    public ResponseEntity<Page<PostResponse>> getPublicFeed(
            @RequestParam(defaultValue = "0") int page) {
        return ResponseEntity.ok(postService.getPublicFeed(PageRequest.of(page, 10)));
    }

    @GetMapping("/feed")
    public ResponseEntity<Page<PostResponse>> getFeed(
            @RequestParam(defaultValue = "0") int page,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(postService.getFeed(userDetails.getUsername(), PageRequest.of(page, 10)));
    }

    @GetMapping("/discover")
    public ResponseEntity<Page<PostResponse>> getDiscover(
            @RequestParam(defaultValue = "0") int page,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(postService.getDiscover(userDetails.getUsername(), PageRequest.of(page, 10)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPost(@PathVariable Long id,
                                                  @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(postService.getPostById(id, userDetails.getUsername()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id,
                                            @AuthenticationPrincipal UserDetails userDetails) {
        postService.deletePost(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<List<PostResponse>> getUserPosts(@PathVariable String username,
                                                            @AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails != null ? userDetails.getUsername() : null;
        return ResponseEntity.ok(postService.getUserPosts(username, email));
    }

    @GetMapping("/hashtag/{tag}")
    public ResponseEntity<Page<PostResponse>> getByHashtag(
            @PathVariable String tag,
            @RequestParam(defaultValue = "0") int page,
            @AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails != null ? userDetails.getUsername() : null;
        return ResponseEntity.ok(postService.getPostsByHashtag(tag, email, PageRequest.of(page, 20)));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<PostResponse>> searchPosts(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(postService.searchPosts(q, userDetails.getUsername(), PageRequest.of(page, 10)));
    }
}
