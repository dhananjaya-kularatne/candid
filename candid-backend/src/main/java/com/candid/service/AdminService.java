package com.candid.service;

import com.candid.dto.*;
import com.candid.entity.*;
import com.candid.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final ReportRepository reportRepository;
    private final HashtagRepository hashtagRepository;
    private final UserService userService;
    private final PostService postService;
    private final NotificationService notificationService;

    public AdminStatsResponse getStats() {
        long totalUsers = userRepository.count();
        long totalPosts = postRepository.count();
        long postsToday = postRepository.countPostsToday();
        long pendingReports = reportRepository.countByStatus(Report.Status.PENDING);
        return new AdminStatsResponse(totalUsers, totalPosts, postsToday, pendingReports);
    }

    public Page<UserResponse> getUsers(String search, Pageable pageable) {
        Page<User> users;
        if (search != null && !search.isBlank()) {
            users = userRepository.findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(search, search, pageable);
        } else {
            users = userRepository.findAll(PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(Sort.Direction.DESC, "id")));
        }
        List<UserResponse> responses = users.getContent().stream()
                .map(u -> userService.mapToResponse(u, null))
                .collect(Collectors.toList());
        return new PageImpl<>(responses, pageable, users.getTotalElements());
    }

    @Transactional
    public void banUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(User.Status.BANNED);
        userRepository.save(user);
    }

    @Transactional
    public void unbanUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(User.Status.ACTIVE);
        userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }

    public Page<PostResponse> getPosts(String mood, String adminEmail, Pageable pageable) {
        User admin = userService.getUserEntityByEmail(adminEmail);
        Page<Post> posts;
        if (mood != null && !mood.isBlank()) {
            posts = postRepository.findByMood(mood, pageable);
        } else {
            posts = postRepository.findAll(PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(Sort.Direction.DESC, "id")));
        }
        List<PostResponse> responses = posts.getContent().stream()
                .map(p -> postService.mapToResponse(p, admin))
                .collect(Collectors.toList());
        return new PageImpl<>(responses, pageable, posts.getTotalElements());
    }

    @Transactional
    public void adminDeletePost(Long postId) {
        postService.adminDeletePost(postId);
    }

    public Page<ReportResponse> getReports(Pageable pageable) {
        Page<Report> reports = reportRepository.findAll(pageable);
        List<ReportResponse> responses = reports.getContent().stream()
                .map(this::mapReport).collect(Collectors.toList());
        return new PageImpl<>(responses, pageable, reports.getTotalElements());
    }

    @Transactional
    public void dismissReport(Long reportId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        report.setStatus(Report.Status.DISMISSED);
        reportRepository.save(report);
    }

    @Transactional
    public void resolveReportDeletePost(Long reportId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        report.setStatus(Report.Status.RESOLVED);
        reportRepository.save(report);
        postRepository.delete(report.getPost());
    }

    public Page<HashtagResponse> getHashtags(Pageable pageable) {
        return hashtagRepository.findAll(pageable)
                .map(h -> new HashtagResponse(h.getId(), h.getName(), 0L, false));
    }

    public void sendAnnouncement(String title, String message) {
        notificationService.sendAnnouncement(title, message);
    }

    private ReportResponse mapReport(Report r) {
        ReportResponse resp = new ReportResponse();
        resp.setId(r.getId());
        resp.setReason(r.getReason());
        resp.setStatus(r.getStatus().name());
        resp.setCreatedAt(r.getCreatedAt().atZone(java.time.ZoneId.systemDefault()).toInstant());
        resp.setReporter(userService.mapToResponse(r.getReporter(), null));
        resp.setPost(postService.mapToResponse(r.getPost(), null));
        return resp;
    }
}
