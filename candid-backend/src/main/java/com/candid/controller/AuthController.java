package com.candid.controller;

import com.candid.dto.AuthResponse;
import com.candid.dto.LoginRequest;
import com.candid.dto.RegisterRequest;
import com.candid.dto.UserResponse;
import com.candid.service.AuthService;
import com.candid.service.PasswordResetService;
import com.candid.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserService userService;
    private final PasswordResetService passwordResetService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.getUserByEmail(userDetails.getUsername()));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody Map<String, String> body) {
        passwordResetService.sendOtp(body.get("email"));
        return ResponseEntity.ok(Map.of("message", "OTP sent to your email address."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody Map<String, String> body) {
        passwordResetService.resetPassword(body.get("email"), body.get("otp"), body.get("newPassword"));
        return ResponseEntity.ok(Map.of("message", "Password reset successfully."));
    }
}
