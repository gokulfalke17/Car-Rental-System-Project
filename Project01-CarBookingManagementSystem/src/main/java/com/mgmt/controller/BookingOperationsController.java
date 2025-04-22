package com.mgmt.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mgmt.entity.Booking;
import com.mgmt.entity.Booking.BookingStatus;
import com.mgmt.entity.User;
import com.mgmt.service.IBookingService;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingOperationsController {

	@Autowired
	private IBookingService bookingService;

	@PostMapping("/book")
	public ResponseEntity<?> createBooking(@RequestBody Booking booking) {

		if (booking.getUser() == null || booking.getVehicle() == null) {
			return ResponseEntity.badRequest().body("User or Vehicle must not be null.");
		}

		try {
			Booking savedBooking = bookingService.bookVehicle(booking.getVehicle().getVehicleId(),
					booking.getUser().getUserId(), booking.getFromDate(), booking.getToDate());
			return ResponseEntity.ok(savedBooking);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body("Error occurred while booking: " + e.getMessage());
		}
	}

	@GetMapping("/admin/bookings")
	public ResponseEntity<List<Booking>> fetchAllBooking() {
		List<Booking> bookings = bookingService.getAllBookings();
		return new ResponseEntity<List<Booking>>(bookings, HttpStatus.OK);
	}

	@GetMapping("/user/{userId}")
	public ResponseEntity<List<Booking>> getBookingsByUserId(@PathVariable("userId") Integer userId) {
		List<Booking> bookings = bookingService.getBookingsByUserId(userId);
		return new ResponseEntity<>(bookings, HttpStatus.OK);
	}

	@GetMapping("/{bookingId}")
	public ResponseEntity<Booking> getBookingById(@PathVariable("bookingId") Integer bookingId) {
		Optional<Booking> booking = bookingService.getBookingById(bookingId);
		if (booking.isPresent()) {
			return ResponseEntity.ok(booking.get());
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}
	}

	@PutMapping("/cancel/{bookingId}")
	public ResponseEntity<String> cancelBooking(@PathVariable("bookingId") Integer bookingId) {
		boolean updated = bookingService.updateBookingStatus(bookingId, BookingStatus.CANCELLED);
		if (updated) {
			return ResponseEntity.ok("Booking status updated to canceled.");
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Booking not found.");
		}
	}

	@PutMapping("/update-status/{bookingId}")
	public ResponseEntity<?> updateBookingStatus(@PathVariable("bookingId") Integer bookingId,
			@RequestBody Booking bookingRequest) {
		try {
			boolean updated = bookingService.updateBookingStatus(bookingId, bookingRequest.getStatus());

			if (updated) {
				Booking updatedBooking = (Booking) bookingService.getBookingsByUserId(bookingId);

				return ResponseEntity.ok(updatedBooking);
			} else {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Booking not found.");
			}
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
		}
	}
	
	
	@GetMapping("/customer/{userId}")
	public ResponseEntity<List<Booking>> getBookingsByCustomerId(@PathVariable Integer userId) {
	    List<Booking> userReport = bookingService.getBookingUserReportByUserId(userId);
	    return new ResponseEntity<>(userReport, HttpStatus.OK);
	}
}

/*

 http://localhost:4041/api/bookings/book
 
{"user":{"userId":1},"vehicle":{"vehicleId":8},"fromDate":"2025-04-16","toDate":"2025-04-18"}

*/