package com.thekindlestudio.booking;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByPhoneOrderByEventDateDescCreatedAtDesc(String phone);

    List<Booking> findBySpaceNameAndEventDateAndStatusNot(String spaceName, LocalDate eventDate, BookingStatus status);

    List<Booking> findAllByOrderByEventDateDescCreatedAtDesc();
}


