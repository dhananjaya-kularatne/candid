package com.candid.service;

import com.candid.entity.User;
import com.candid.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final UserRepository userRepository;
    private final JavaMailSender mailSender;
    private final PasswordEncoder passwordEncoder;

    private record OtpEntry(String otp, long expiry) {}

    private final Map<String, OtpEntry> otpStore = new ConcurrentHashMap<>();

    public void sendOtp(String email) {
        userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new RuntimeException("No account found with this email address."));

        String otp = String.format("%06d", new Random().nextInt(1000000));
        long expiry = Instant.now().toEpochMilli() + 600_000L; // 10 minutes
        otpStore.put(email.toLowerCase(), new OtpEntry(otp, expiry));

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Candid — Password Reset OTP");
            message.setText(
                "Hi,\n\n" +
                "You requested a password reset for your Candid account.\n\n" +
                "Your OTP is: " + otp + "\n\n" +
                "This code expires in 10 minutes. If you didn't request this, ignore this email.\n\n" +
                "— The Candid Team"
            );
            mailSender.send(message);
        } catch (Exception e) {
            otpStore.remove(email.toLowerCase());
            throw new RuntimeException("Failed to send OTP email. Please check your email address and try again.");
        }
    }

    public void resetPassword(String email, String otp, String newPassword) {
        String key = email.toLowerCase();
        OtpEntry entry = otpStore.get(key);

        if (entry == null) {
            throw new RuntimeException("No OTP was requested for this email.");
        }
        if (Instant.now().toEpochMilli() > entry.expiry()) {
            otpStore.remove(key);
            throw new RuntimeException("OTP has expired. Please request a new one.");
        }
        if (!entry.otp().equals(otp)) {
            throw new RuntimeException("Incorrect OTP. Please try again.");
        }

        User user = userRepository.findByEmail(key)
                .orElseThrow(() -> new RuntimeException("User not found."));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        otpStore.remove(key);
    }
}
