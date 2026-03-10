package com.thekindlestudio.payment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByOrderId(String orderId);
    List<Payment> findByPhoneNumber(String phoneNumber);
    List<Payment> findByStatus(PaymentStatus status);
    Optional<Payment> findByBookingId(Long bookingId);
}
