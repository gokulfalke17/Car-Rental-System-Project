package com.mgmt.service;

import com.mgmt.entity.Payment;

public interface IPaymentService {

	// public Payment processPayment(Integer bookingId, String cardNumber, String
	// expiryDate, String cvv, String cardholderName);
	public Payment processCreditCardPayment(Integer bookingId, String cardNumber, String expiryDate, String cvv,
			String cardHolderName);

	public Payment processDebitCardPayment(Integer bookingId, String cardNumber, String expiryDate, String cvv,
			String cardHolderName);

	public Payment processUpiPayment(Integer bookingId, String upiId, String paymentOption);

	Payment processCashOnDelivery(Integer bookingId);

}
