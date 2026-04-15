package com.candid.controller.admin;

import com.candid.dto.*;
import com.candid.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // --- Dashboard ---
    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }

    // --- Users ---
    @GetMapping("/users")
    public ResponseEntity<Page<UserResponse>> getUsers(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page) {
        return ResponseEntity.ok(adminService.getUsers(search, 
            PageRequest.of(page, 20, Sort.by("id").descending())));
    }

    @PutMapping("/users/{id}/ban")
    public ResponseEntity<Void> banUser(@PathVariable Long id) {
        adminService.banUser(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/users/{id}/unban")
    public ResponseEntity<Void> unbanUser(@PathVariable Long id) {
        adminService.unbanUser(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // --- Posts ---
    @GetMapping("/posts")
    public ResponseEntity<Page<PostResponse>> getPosts(
            @RequestParam(required = false) String mood,
            @RequestParam(defaultValue = "0") int page,
            @AuthenticationPrincipal UserDetails userDetails) {
        // Ensure the sort is absolutely forced here as well
        Pageable pageable = PageRequest.of(page, 20, Sort.by(Sort.Direction.DESC, "createdAt", "id"));
        return ResponseEntity.ok(adminService.getPosts(mood, userDetails.getUsername(), pageable));
    }

    @DeleteMapping("/posts/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        adminService.adminDeletePost(id);
        return ResponseEntity.noContent().build();
    }

    // --- Reports ---
    @GetMapping("/reports")
    public ResponseEntity<Page<ReportResponse>> getReports(@RequestParam(defaultValue = "0") int page) {
        return ResponseEntity.ok(adminService.getReports(
            PageRequest.of(page, 20, Sort.by("createdAt").descending())));
    }

    @PutMapping("/reports/{id}/dismiss")
    public ResponseEntity<Void> dismissReport(@PathVariable Long id) {
        adminService.dismissReport(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/reports/{id}/delete-post")
    public ResponseEntity<Void> resolveReport(@PathVariable Long id) {
        adminService.resolveReportDeletePost(id);
        return ResponseEntity.ok().build();
    }

    // --- Hashtags ---
    @GetMapping("/hashtags")
    public ResponseEntity<Page<HashtagResponse>> getHashtags(@RequestParam(defaultValue = "0") int page) {
        return ResponseEntity.ok(adminService.getHashtags(
            PageRequest.of(page, 20, Sort.by("name").ascending())));
    }

    // --- Announcements ---
    @PostMapping("/announcements")
    public ResponseEntity<Void> sendAnnouncement(@Valid @RequestBody AnnouncementRequest request) {
        adminService.sendAnnouncement(request.getTitle(), request.getMessage());
        return ResponseEntity.ok().build();
    }
}
