package com.candid.controller;

import com.candid.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping("/{id}/report")
    public ResponseEntity<Void> reportPost(@PathVariable Long id,
                                            @RequestBody Map<String, String> body,
                                            @AuthenticationPrincipal UserDetails userDetails) {
        reportService.reportPost(userDetails.getUsername(), id, body.get("reason"));
        return ResponseEntity.ok().build();
    }
}
