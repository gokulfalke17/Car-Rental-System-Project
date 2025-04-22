package com.mgmt.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mgmt.entity.Payment;
import com.mgmt.service.IPaymentService;

@RestController
@RequestMapping("/api/payment")
public class PaymentOperationsController {

	@Autowired
	public IPaymentService paymentService;

	/*@PostMapping("/process")
	public ResponseEntity<Payment> processPayment(@RequestParam Integer bookingId, @RequestParam String cardNumber,
			@RequestParam String expiryDate, @RequestParam String cvv, @RequestParam String cardHolderName) {
	
		Payment payment = paymentService.processPayment(bookingId, cardNumber, expiryDate, cvv, cardHolderName);
		
		return new ResponseEntity<Payment>(payment, HttpStatus.OK);
	
	}*/
	
	 // Credit Card Payment
    @PostMapping("/credit-card")
    public ResponseEntity<Payment> processCreditCardPayment(@RequestParam Integer bookingId,
                                                             @RequestParam String cardNumber,
                                                             @RequestParam String expiryDate,
                                                             @RequestParam String cvv,
                                                             @RequestParam String cardHolderName) {
        Payment payment = paymentService.processCreditCardPayment(bookingId, cardNumber, expiryDate, cvv, cardHolderName);
        return new ResponseEntity<>(payment, HttpStatus.OK);
    }

    // Debit Card Payment
    @PostMapping("/debit-card")
    public ResponseEntity<Payment> processDebitCardPayment(@RequestParam Integer bookingId,
                                                            @RequestParam String cardNumber,
                                                            @RequestParam String expiryDate,
                                                            @RequestParam String cvv,
                                                            @RequestParam String cardHolderName) {
        Payment payment = paymentService.processDebitCardPayment(bookingId, cardNumber, expiryDate, cvv, cardHolderName);
        return new ResponseEntity<>(payment, HttpStatus.OK);
    }

    // UPI Payment
    @PostMapping("/upi")
    public ResponseEntity<Payment> processUpiPayment(@RequestParam Integer bookingId,
                                                     @RequestParam String upiId,
                                                     @RequestParam String paymentOption) {
        Payment payment = paymentService.processUpiPayment(bookingId, upiId, paymentOption);
        return new ResponseEntity<>(payment, HttpStatus.OK);
    }
}



/*
SELECT u.first_name, u.last_name, u.email, u.contact, u.city, b.booking_date, b.from_date, b.to_date,
b.status AS booking_status, b.total_price, v.vehicle_registration_number, var.variant_name,
var.variant_desc, var.fuel_type, var.rent_per_day, var.seat_capacity, var.model_number, var.year,
var.image_url FROM user u JOIN booking b ON u.user_id = b.user_id JOIN vehicles v ON
b.vehicle_id = v.vehicle_id JOIN variant var ON v.variant_id = var.variant_id ORDER BY b.booking_id;
*/
