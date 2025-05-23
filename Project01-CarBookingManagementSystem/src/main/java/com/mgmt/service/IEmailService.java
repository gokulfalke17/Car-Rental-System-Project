package com.mgmt.service;

import com.mgmt.entity.BookingDetails;

public interface IEmailService {
	
	public void sendBookingDetails(BookingDetails details);
}
