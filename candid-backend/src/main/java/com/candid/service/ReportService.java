package com.candid.service;

import com.candid.entity.Post;
import com.candid.entity.Report;
import com.candid.entity.User;
import com.candid.repository.PostRepository;
import com.candid.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final PostRepository postRepository;
    private final UserService userService;

    @Transactional
    public void reportPost(String email, Long postId, String reason) {
        User reporter = userService.getUserEntityByEmail(email);
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Report report = new Report();
        report.setReporter(reporter);
        report.setPost(post);
        report.setReason(reason);
        report.setStatus(Report.Status.PENDING);
        reportRepository.save(report);
    }
}
