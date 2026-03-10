package com.thekindlestudio.booking;

import jakarta.validation.Valid;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

record BookingRequest(
        @NotBlank @Size(max = 100) String customerName,
        @NotBlank @Size(max = 30) String phone,
        @NotBlank @Size(max = 100) String spaceName,
        @Size(max = 100) String packageName,
        @FutureOrPresent LocalDate eventDate,
        @NotBlank @Size(max = 50) String timeSlot,
        @Size(max = 500) String notes,
        @Size(max = 500) String addOns
) {
}

record BookingSummary(
        Long id,
        String customerName,
        String phone,
        String spaceName,
        String packageName,
        LocalDate eventDate,
        String timeSlot,
        BookingStatus status,
        String notes,
        String addOns
) {
}

record BookingUpdateRequest(
        String customerName,
        String phone,
        String spaceName,
        String packageName,
        LocalDate eventDate,
        String timeSlot,
        String notes,
        String addOns,
        BookingStatus status
) {
}

record AvailabilityResponse(
        String spaceName,
        LocalDate date,
        List<String> bookedSlots
) {
}

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private static final List<String> ALL_SLOTS = List.of(
            "10:00 - 13:00",
            "13:00 - 16:00",
            "16:00 - 19:00",
            "19:00 - 22:00"
    );

    private final BookingRepository repository;

    public BookingController(BookingRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public ResponseEntity<BookingSummary> create(@Valid @RequestBody BookingRequest request) {
        Booking booking = new Booking();
        booking.setCustomerName(request.customerName());
        booking.setPhone(request.phone());
        booking.setSpaceName(request.spaceName());
        booking.setPackageName(request.packageName());
        booking.setEventDate(request.eventDate());
        booking.setTimeSlot(request.timeSlot());
        booking.setNotes(request.notes());
        booking.setAddOns(request.addOns());
        booking.setStatus(BookingStatus.PENDING);

        Booking saved = repository.save(booking);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(toSummary(saved));
    }

    @GetMapping("/by-phone")
    public List<BookingSummary> findByPhone(
            @RequestParam("phone")
            @NotBlank
            @Size(max = 30)
            @Pattern(regexp = "^[0-9+\\-\\s]+$")
            String phone
    ) {
        return repository.findByPhoneOrderByEventDateDescCreatedAtDesc(phone.trim())
                .stream()
                .map(this::toSummary)
                .toList();
    }

    @GetMapping("/availability")
    public AvailabilityResponse availability(
            @RequestParam("spaceName") @NotBlank String spaceName,
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        Set<String> booked = repository
                .findBySpaceNameAndEventDateAndStatusNot(spaceName, date, BookingStatus.CANCELLED)
                .stream()
                .map(Booking::getTimeSlot)
                .collect(Collectors.toSet());

        List<String> bookedSlots = ALL_SLOTS.stream()
                .filter(booked::contains)
                .toList();

        return new AvailabilityResponse(spaceName, date, bookedSlots);
    }

    // Admin endpoints
    @GetMapping("/admin/all")
    public List<BookingSummary> getAllBookings() {
        return repository.findAllByOrderByEventDateDescCreatedAtDesc()
                .stream()
                .map(this::toSummary)
                .toList();
    }

    @GetMapping("/admin/{id}")
    public ResponseEntity<BookingSummary> getBookingById(@PathVariable Long id) {
        Optional<Booking> booking = repository.findById(id);
        if (booking.isPresent()) {
            return ResponseEntity.ok(toSummary(booking.get()));
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/admin/{id}")
    public ResponseEntity<BookingSummary> updateBooking(
            @PathVariable Long id,
            @Valid @RequestBody BookingUpdateRequest request
    ) {
        Optional<Booking> bookingOpt = repository.findById(id);
        if (bookingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Booking booking = bookingOpt.get();
        
        if (request.customerName() != null) {
            booking.setCustomerName(request.customerName());
        }
        if (request.phone() != null) {
            booking.setPhone(request.phone());
        }
        if (request.spaceName() != null) {
            booking.setSpaceName(request.spaceName());
        }
        if (request.packageName() != null) {
            booking.setPackageName(request.packageName());
        }
        if (request.eventDate() != null) {
            booking.setEventDate(request.eventDate());
        }
        if (request.timeSlot() != null) {
            booking.setTimeSlot(request.timeSlot());
        }
        if (request.notes() != null) {
            booking.setNotes(request.notes());
        }
        if (request.addOns() != null) {
            booking.setAddOns(request.addOns());
        }
        if (request.status() != null) {
            booking.setStatus(request.status());
        }

        Booking updated = repository.save(booking);
        return ResponseEntity.ok(toSummary(updated));
    }

    private BookingSummary toSummary(Booking booking) {
        return new BookingSummary(
                booking.getId(),
                booking.getCustomerName(),
                booking.getPhone(),
                booking.getSpaceName(),
                booking.getPackageName(),
                booking.getEventDate(),
                booking.getTimeSlot(),
                booking.getStatus(),
                booking.getNotes(),
                booking.getAddOns()
        );
    }
}


