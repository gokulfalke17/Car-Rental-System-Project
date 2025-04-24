package com.mgmt.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.mgmt.entity.Booking;
import com.mgmt.entity.Booking.BookingStatus;
import com.mgmt.entity.User;

@Service
public interface IBookingService {
	public Booking bookVehicle(Integer vehicleId, Integer userId, LocalDate from_date, LocalDate to_date);

	public List<Booking> getAllBookings();

	public List<Booking> getBookingsByUserId(Integer userId);

	public Optional<Booking> getBookingById(Integer bookingId);

	public boolean updateBookingStatus(Integer bookingId, BookingStatus status);
	
	public List<Booking> getBookingUserReportByUserId(Integer userId);
	
	public int countNewBookings();
	
	

	
	

}