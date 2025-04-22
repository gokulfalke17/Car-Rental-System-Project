package com.mgmt.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mgmt.entity.Booking;
import com.mgmt.entity.Payment;
import com.mgmt.repository.IBookingRepository;
import com.mgmt.repository.IPaymentRepository;

@Service
public class PaymentServiceImpl implements IPaymentService {

	@Autowired
	private IPaymentRepository paymentRepository;

	@Autowired
	private IBookingRepository bookingRepository;

	/*@Override
	public Payment processPayment(Integer bookingId, String cardNumber, String expiryDate, String cvv,
			String cardholderName) {
	
		System.out.println(cardNumber);
		
		if (cardNumber == null || cardNumber.length() != 16) {
			throw new IllegalArgumentException("Invalid card number");
		}
	
		// Fetch booking
		Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new RuntimeException("Booking not found"));
	
		// Create and save payment
		Payment payment = new Payment();
		payment.setBooking(booking);
		payment.setAmount(booking.getTotalPrice());
		payment.setPaymentMethod("CREDIT_CARD");
		payment.setTransactionId(UUID.randomUUID().toString());
		payment.setStatus(Payment.PaymentStatus.COMPLETED); 
		payment.setPaymentDate(LocalDateTime.now());
	
		paymentRepository.save(payment);
	
		// Update booking status
		booking.setStatus(Booking.BookingStatus.COMPLETED);
		bookingRepository.save(booking);
	
		return payment;
	
	}*/
	
	
	 @Override
	    public Payment processCreditCardPayment(Integer bookingId, String cardNumber, String expiryDate, String cvv, String cardHolderName) {
	        if (cardNumber == null || cardNumber.length() != 16) {
	            throw new IllegalArgumentException("Invalid card number");
	        }

	        // Fetch booking
	        Booking booking = bookingRepository.findById(bookingId)
	                .orElseThrow(() -> new RuntimeException("Booking not found"));

	        // Create and save payment
	        Payment payment = new Payment();
	        payment.setBooking(booking);
	        payment.setAmount(booking.getTotalPrice());
	        payment.setPaymentMethod("CREDIT_CARD");
	        payment.setTransactionId(UUID.randomUUID().toString());
	        payment.setStatus(Payment.PaymentStatus.COMPLETED); 
	        payment.setPaymentDate(LocalDateTime.now());

	        paymentRepository.save(payment);

	        // Update booking status
	        booking.setStatus(Booking.BookingStatus.COMPLETED);
	        bookingRepository.save(booking);

	        return payment;
	    }

	    // Debit Card Payment
	    @Override
	    public Payment processDebitCardPayment(Integer bookingId, String cardNumber, String expiryDate, String cvv, String cardHolderName) {
	        if (cardNumber == null || cardNumber.length() != 16) {
	            throw new IllegalArgumentException("Invalid card number");
	        }

	        // Fetch booking
	        Booking booking = bookingRepository.findById(bookingId)
	                .orElseThrow(() -> new RuntimeException("Booking not found"));

	        // Create and save payment
	        Payment payment = new Payment();
	        payment.setBooking(booking);
	        payment.setAmount(booking.getTotalPrice());
	        payment.setPaymentMethod("DEBIT_CARD");
	        payment.setTransactionId(UUID.randomUUID().toString());
	        payment.setStatus(Payment.PaymentStatus.COMPLETED); 
	        payment.setPaymentDate(LocalDateTime.now());

	        paymentRepository.save(payment);

	        // Update booking status
	        booking.setStatus(Booking.BookingStatus.COMPLETED);
	        bookingRepository.save(booking);

	        return payment;
	    }

	    // UPI Payment
	    @Override
	    public Payment processUpiPayment(Integer bookingId, String upiId, String paymentOption) {
	        if (upiId == null || upiId.isEmpty()) {
	            throw new IllegalArgumentException("UPI ID is required");
	        }

	        // Fetch booking
	        Booking booking = bookingRepository.findById(bookingId)
	                .orElseThrow(() -> new RuntimeException("Booking not found"));

	        // Create and save payment
	        Payment payment = new Payment();
	        payment.setBooking(booking);
	        payment.setAmount(booking.getTotalPrice());
	        payment.setPaymentMethod(paymentOption);  // For UPI, paymentOption will indicate the payment mode
	        payment.setTransactionId(UUID.randomUUID().toString());
	        payment.setStatus(Payment.PaymentStatus.COMPLETED);
	        payment.setPaymentDate(LocalDateTime.now());

	        paymentRepository.save(payment);

	        // Update booking status
	        booking.setStatus(Booking.BookingStatus.COMPLETED);
	        bookingRepository.save(booking);

	        return payment;
	    }

}
