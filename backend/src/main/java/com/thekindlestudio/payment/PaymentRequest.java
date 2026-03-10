package com.thekindlestudio.payment;

public record PaymentRequest(
    String phoneNumber,
    Long amount,
    String paymentSource,
    String cardLastFour,
    String cardBrand,
    String upiId,
    Long bookingId,
    Long addonsTotal
) {}
