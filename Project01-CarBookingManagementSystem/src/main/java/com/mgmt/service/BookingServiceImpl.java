package com.mgmt.service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.mgmt.entity.Booking;
import com.mgmt.entity.Booking.BookingStatus;
import com.mgmt.entity.User;
import com.mgmt.entity.Vehicle;
import com.mgmt.repository.IBookingRepository;
import com.mgmt.repository.ILicenseRepository;
import com.mgmt.repository.IUserRepository;
import com.mgmt.repository.IVehicleRepository;

@Service
public class BookingServiceImpl implements IBookingService {

	@Autowired
	private IBookingRepository bookingRepository;

	@Autowired
	private IUserRepository userRepository;

	@Autowired
	private IVehicleRepository vehicleRepository;

	@Autowired
	public ILicenseRepository licenseRepository;
	
	

	/*@Override
	public Booking bookVehicle(Integer vehicleId, Integer userId, LocalDate fromDate, LocalDate toDate) {
		Vehicle vehicle = vehicleRepository.findById(vehicleId)
				.orElseThrow(() -> new RuntimeException("Vehicle not found"));
	
		if (vehicle.getVariant() == null) {
			throw new RuntimeException("Vehicle variant not specified");
		}
	
		User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
	
		if (fromDate.isAfter(toDate)) {
			throw new RuntimeException("From date cannot be after to date");
		}
	
		long numberOfDays = ChronoUnit.DAYS.between(fromDate, toDate) + 1;
	
		double dailyRate = vehicle.getVariant().getRentPerDay();
		if (dailyRate <= 0) {
			throw new RuntimeException("Invalid daily rate for vehicle variant");
		}
	
		// Calculate total price
		double totalPrice = dailyRate * numberOfDays;
	
		// Create and save booking
		Booking booking = new Booking();
		booking.setVehicle(vehicle);
		booking.setUser(user);
		booking.setFromDate(fromDate);
		booking.setToDate(toDate);
		booking.setBookingDate(LocalDate.now());
		booking.setStatus(Booking.BookingStatus.PENDING);
		booking.setTotalPrice(totalPrice);
	
		return bookingRepository.save(booking);
	}
	*/
	
	
	@Override
	public Booking bookVehicle(Integer vehicleId, Integer userId, LocalDate fromDate, LocalDate toDate) {
	    Vehicle vehicle = vehicleRepository.findById(vehicleId)
	            .orElseThrow(() -> new RuntimeException("Vehicle not found"));

	    if (vehicle.getVariant() == null) {
	        throw new RuntimeException("Vehicle variant not specified");
	    }

	    if (!"available".equalsIgnoreCase(vehicle.getStatus())) {
	        throw new RuntimeException("Vehicle is not available for booking.");
	    }

	    User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

	    if (fromDate.isAfter(toDate)) {
	        throw new RuntimeException("From date cannot be after to date");
	    }

	    long numberOfDays = ChronoUnit.DAYS.between(fromDate, toDate) + 1;
	    double dailyRate = vehicle.getVariant().getRentPerDay();

	    if (dailyRate <= 0) {
	        throw new RuntimeException("Invalid daily rate for vehicle variant");
	    }

	    double totalPrice = dailyRate * numberOfDays;

	    vehicle.setStatus("Booked");
	    vehicleRepository.save(vehicle); 

	    Booking booking = new Booking();
	    booking.setVehicle(vehicle);
	    booking.setUser(user);
	    booking.setFromDate(fromDate);
	    booking.setToDate(toDate);
	    booking.setBookingDate(LocalDate.now());
	    booking.setStatus(Booking.BookingStatus.PENDING);
	    booking.setTotalPrice(totalPrice);

	    return bookingRepository.save(booking);
	}


	@Override
	public List<Booking> getAllBookings() {
		List<Booking> bookings = bookingRepository.findAll();
		return bookings;
	}

	@Override
	public List<Booking> getBookingsByUserId(Integer userId) {
		return bookingRepository.findByUserUserId(userId);
	}

	@Override
	public Optional<Booking> getBookingById(Integer bookingId) {
		return bookingRepository.findById(bookingId);
	}

	@Override
	public boolean updateBookingStatus(Integer bookingId, BookingStatus status) {
		Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
		if (bookingOpt.isPresent()) {
			Booking booking = bookingOpt.get();
			booking.setStatus(status);
			bookingRepository.save(booking);
			return true;
		}
		return false;
	}

	@Override
	public List<Booking> getBookingUserReportByUserId(Integer userId) {
	    return bookingRepository.findBookingsByUserId(userId);
	}
	
	public int countNewBookings() {
	    return bookingRepository.countByStatus(BookingStatus.PENDING); // Or whatever status you use for new
	}
	
	

	/*@Scheduled(cron = "0 0 0 * * ?") 
	public void updateExpiredBookings() {
	    LocalDate today = LocalDate.now();
	
	    List<Booking> bookings = bookingRepository.findAll();
	
	    for (Booking booking : bookings) {
	        if (Booking.BookingStatus.CONFIRMED.equals(booking.getStatus()) && booking.getToDate().isBefore(today)) {
	            Vehicle vehicle = booking.getVehicle();
	
	            if (vehicle != null && "Booked".equalsIgnoreCase(vehicle.getStatus())) {  
	                vehicle.setStatus("Available");  
	                vehicleRepository.save(vehicle);
	            }
	
	            booking.setStatus(Booking.BookingStatus.COMPLETED);  
	            bookingRepository.save(booking);  
	        }
	    }
	}*/

	
	@Scheduled(cron = "0 0 * * * *")
	public void updateExpiredBookings() {
	    LocalDate today = LocalDate.now(); 

	    List<Booking> bookings = bookingRepository.findAll();

	    for (Booking booking : bookings) {
	        Vehicle vehicle = booking.getVehicle();

	        if (vehicle != null &&
	            "Booked".equalsIgnoreCase(vehicle.getStatus()) &&
	            booking.getToDate().isBefore(today)) {

	            vehicle.setStatus("Available");
	            vehicleRepository.save(vehicle);
	            System.out.println("Vehicle ID " + vehicle.getVehicleId() + " is now marked as Available.");
	        }
	    }
	}

	
	
	



}
