package com.mgmt.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mgmt.entity.Booking;
import com.mgmt.entity.Feedback;
import com.mgmt.entity.User;
import com.mgmt.entity.Vehicle;
import com.mgmt.repository.IBookingRepository;
import com.mgmt.repository.IFeedbackRepository;
import com.mgmt.repository.IUserRepository;
import com.mgmt.repository.IVehicleRepository;

@Service
public class FeedbackServiceImpl implements IFeedbackService {

	@Autowired
	private IFeedbackRepository feedbackRepo;

	@Autowired
	private IBookingRepository bookingRepo;

	@Autowired
	private IUserRepository userRepo;

	@Autowired
	private IVehicleRepository vehicleRepo;

	@Override
	public String submitFeedback(Feedback feedback) {
		Integer userId = feedback.getUser().getUserId();
		Integer vehicleId = feedback.getVehicle().getVehicleId();

		List<Booking> bookings = bookingRepo.findByUserUserIdAndVehicleVehicleIdAndStatusIn(userId, vehicleId,
				List.of(Booking.BookingStatus.CONFIRMED, Booking.BookingStatus.COMPLETED));

		if (bookings.isEmpty()) {
			return "You have to Book the Car and Pay Amount After that U can Give Feedback.!";
		}

		User user = userRepo.findById(userId).orElse(null);
		Vehicle vehicle = vehicleRepo.findById(vehicleId).orElse(null);

		feedback.setUser(user);
		feedback.setVehicle(vehicle);

		feedbackRepo.save(feedback);
		return "Feedback Submitted Successfully...";
	}
	
	@Override
	public List<Feedback> getAllFeedbacks() {
	    return feedbackRepo.findAll();
	}
}