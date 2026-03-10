package com.thekindlestudio.payment;

import java.time.OffsetDateTime;

public record PaymentResponse(
    String orderId,
    String phoneNumber,
    Long amount,
    String paymentSource,
    String status,
    OffsetDateTime createdAt
) {}
