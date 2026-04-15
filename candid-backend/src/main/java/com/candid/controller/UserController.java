package com.candid.controller;

import com.candid.dto.UserResponse;
import com.candid.entity.User;
import com.candid.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{username}")
    public ResponseEntity<UserResponse> getUser(@PathVariable String username,
                                                 @AuthenticationPrincipal UserDetails userDetails) {
        User currentUser = userDetails != null ? userService.getUserEntityByEmail(userDetails.getUsername()) : null;
        return ResponseEntity.ok(userService.getUserByUsername(username, currentUser));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String bio,
            @RequestParam(required = false) Boolean isPrivate,
            @RequestParam(required = false) MultipartFile avatar,
            @RequestParam(required = false) MultipartFile banner,
            @AuthenticationPrincipal UserDetails userDetails) throws IOException {
        return ResponseEntity.ok(userService.updateProfile(userDetails.getUsername(), name, bio, isPrivate, avatar, banner));
    }

    @GetMapping("/suggested")
    public ResponseEntity<List<UserResponse>> getSuggested(@AuthenticationPrincipal UserDetails userDetails) {
        User currentUser = userService.getUserEntityByEmail(userDetails.getUsername());
        return ResponseEntity.ok(userService.getSuggestedUsers(currentUser, PageRequest.of(0, 5)));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<UserResponse>> search(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @AuthenticationPrincipal UserDetails userDetails) {
        User currentUser = userService.getUserEntityByEmail(userDetails.getUsername());
        return ResponseEntity.ok(userService.searchUsers(q, currentUser, PageRequest.of(page, 10)));
    }
}
