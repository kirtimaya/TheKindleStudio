package com.thekindlestudio.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    private static final int OTP_VALIDITY_MINUTES = 10;
    private static final Random random = new Random();

    @PostMapping("/send-otp")
    public ResponseEntity<OtpResponse> sendOtp(@RequestBody SendOtpRequest request) {
        String email = request.email();

        // Validate email format
        if (email == null || !email.matches("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$")) {
            return ResponseEntity.badRequest().body(new OtpResponse(false, "Invalid email address format."));
        }
        email = email.toLowerCase().trim();

        // Generate 6-digit OTP
        String otp = String.format("%06d", random.nextInt(999999));

        // Get or create user
        Optional<User> existingUser = userRepository.findByEmail(email);
        User user;

        if (existingUser.isPresent()) {
            user = existingUser.get();
        } else {
            user = new User();
            user.setEmail(email);
            user.setIsVerified(false);
        }

        // Set OTP and expiry
        user.setOtpCode(otp);
        user.setOtpExpiry(OffsetDateTime.now().plusMinutes(OTP_VALIDITY_MINUTES));
        userRepository.save(user);

        // In a real scenario, you would send this OTP via Email service
        System.out.println("OTP for " + email + ": " + otp);

        return ResponseEntity.ok(new OtpResponse(true, "OTP sent to " + email + ". For demo purposes, OTP is: " + otp));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<VerifyOtpResponse> verifyOtp(@RequestBody VerifyOtpRequest request) {
        String email = request.email() != null ? request.email().toLowerCase().trim() : null;
        String otp = request.otp();

        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body(new VerifyOtpResponse(false, "Email not found. Please send OTP first.", null));
        }

        User user = userOptional.get();

        // Check if OTP exists and is not expired
        if (user.getOtpCode() == null || user.getOtpExpiry() == null) {
            return ResponseEntity.badRequest().body(new VerifyOtpResponse(false, "No OTP found. Please request a new OTP.", null));
        }

        if (OffsetDateTime.now().isAfter(user.getOtpExpiry())) {
            return ResponseEntity.badRequest().body(new VerifyOtpResponse(false, "OTP has expired. Please request a new OTP.", null));
        }

        // Verify OTP
        if (!user.getOtpCode().equals(otp)) {
            System.out.println("Verification FAILED for " + email + ": Invalid OTP. Expected " + user.getOtpCode() + " but got " + otp);
            return ResponseEntity.badRequest().body(new VerifyOtpResponse(false, "Invalid OTP. Please try again.", null));
        }

        // Mark user as verified
        user.setIsVerified(true);
        user.setOtpCode(null);
        user.setOtpExpiry(null);
        userRepository.save(user);

        System.out.println("Verification SUCCESS for " + email);
        return ResponseEntity.ok(new VerifyOtpResponse(true, "OTP verified successfully!", email));
    }

    @PostMapping("/logout")
    public ResponseEntity<LogoutResponse> logout(@RequestBody LogoutRequest request) {
        // Client-side session will be cleared
        return ResponseEntity.ok(new LogoutResponse(true, "Logged out successfully"));
    }
}
