package com.candid.controller;

import com.candid.dto.UserResponse;
import com.candid.entity.User;
import com.candid.service.FollowService;
import com.candid.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/follow")
@RequiredArgsConstructor
public class FollowController {

    private final FollowService followService;
    private final UserService userService;

    @PostMapping("/{username}")
    public ResponseEntity<Map<String, String>> follow(@PathVariable String username,
                                                       @AuthenticationPrincipal UserDetails userDetails) {
        String status = followService.follow(userDetails.getUsername(), username);
        return ResponseEntity.ok(Map.of("status", status));
    }

    @DeleteMapping("/{username}")
    public ResponseEntity<Void> unfollow(@PathVariable String username,
                                          @AuthenticationPrincipal UserDetails userDetails) {
        followService.unfollow(userDetails.getUsername(), username);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/requests/{requesterUsername}/accept")
    public ResponseEntity<Void> acceptRequest(@PathVariable String requesterUsername,
                                               @AuthenticationPrincipal UserDetails userDetails) {
        followService.acceptRequest(userDetails.getUsername(), requesterUsername);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/requests/{requesterUsername}/decline")
    public ResponseEntity<Void> declineRequest(@PathVariable String requesterUsername,
                                                @AuthenticationPrincipal UserDetails userDetails) {
        followService.declineRequest(userDetails.getUsername(), requesterUsername);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{username}/followers")
    public ResponseEntity<List<UserResponse>> getFollowers(@PathVariable String username,
                                                            @AuthenticationPrincipal UserDetails userDetails) {
        User currentUser = userService.getUserEntityByEmail(userDetails.getUsername());
        return ResponseEntity.ok(followService.getFollowers(username, currentUser));
    }

    @GetMapping("/{username}/following")
    public ResponseEntity<List<UserResponse>> getFollowing(@PathVariable String username,
                                                            @AuthenticationPrincipal UserDetails userDetails) {
        User currentUser = userService.getUserEntityByEmail(userDetails.getUsername());
        return ResponseEntity.ok(followService.getFollowing(username, currentUser));
    }
}
