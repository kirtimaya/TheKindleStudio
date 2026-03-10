package com.thekindlestudio.payment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentRepository paymentRepository;

    @PostMapping
    public ResponseEntity<PaymentResponse> createPayment(@RequestBody PaymentRequest request) {
        Payment payment = new Payment();
        payment.setPhoneNumber(request.phoneNumber());
        payment.setAmount(request.amount());
        payment.setPaymentSource(request.paymentSource());
        payment.setCardLastFour(request.cardLastFour());
        payment.setCardBrand(request.cardBrand());
        payment.setUpiId(request.upiId());
        payment.setBookingId(request.bookingId());
        payment.setAddonsTotal(request.addonsTotal());
        payment.setStatus(PaymentStatus.PENDING);

        Payment savedPayment = paymentRepository.save(payment);

        return ResponseEntity.ok(new PaymentResponse(
            savedPayment.getOrderId(),
            savedPayment.getPhoneNumber(),
            savedPayment.getAmount(),
            savedPayment.getPaymentSource(),
            savedPayment.getStatus().toString(),
            savedPayment.getCreatedAt()
        ));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<PaymentResponse> getPaymentByOrderId(@PathVariable String orderId) {
        Optional<Payment> payment = paymentRepository.findByOrderId(orderId);

        if (payment.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Payment p = payment.get();
        return ResponseEntity.ok(new PaymentResponse(
            p.getOrderId(),
            p.getPhoneNumber(),
            p.getAmount(),
            p.getPaymentSource(),
            p.getStatus().toString(),
            p.getCreatedAt()
        ));
    }

    @GetMapping("/phone/{phoneNumber}")
    public ResponseEntity<List<Payment>> getPaymentsByPhone(@PathVariable String phoneNumber) {
        List<Payment> payments = paymentRepository.findByPhoneNumber(phoneNumber);
        return ResponseEntity.ok(payments);
    }

    @PutMapping("/{orderId}/complete")
    public ResponseEntity<PaymentResponse> completePayment(@PathVariable String orderId) {
        Optional<Payment> payment = paymentRepository.findByOrderId(orderId);

        if (payment.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Payment p = payment.get();
        p.setStatus(PaymentStatus.COMPLETED);
        Payment updatedPayment = paymentRepository.save(p);

        return ResponseEntity.ok(new PaymentResponse(
            updatedPayment.getOrderId(),
            updatedPayment.getPhoneNumber(),
            updatedPayment.getAmount(),
            updatedPayment.getPaymentSource(),
            updatedPayment.getStatus().toString(),
            updatedPayment.getCreatedAt()
        ));
    }

    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<PaymentResponse> cancelPayment(@PathVariable String orderId) {
        Optional<Payment> payment = paymentRepository.findByOrderId(orderId);

        if (payment.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Payment p = payment.get();
        p.setStatus(PaymentStatus.CANCELLED);
        Payment updatedPayment = paymentRepository.save(p);

        return ResponseEntity.ok(new PaymentResponse(
            updatedPayment.getOrderId(),
            updatedPayment.getPhoneNumber(),
            updatedPayment.getAmount(),
            updatedPayment.getPaymentSource(),
            updatedPayment.getStatus().toString(),
            updatedPayment.getCreatedAt()
        ));
    }
}
