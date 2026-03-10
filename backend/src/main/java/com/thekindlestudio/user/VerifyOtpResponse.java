package com.thekindlestudio.user;

public record VerifyOtpResponse(boolean success, String message, String phoneNumber) {}
