package com.mgmt.controller;

import com.mgmt.entity.BookingDetails;
import com.mgmt.service.IEmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
@CrossOrigin(origins = "http://localhost:3000")
public class EmailController {

    @Autowired
    private IEmailService emailService;

    @PostMapping("/send-bookingDetails")
    public String sendBookingDetails(@RequestBody BookingDetails details) {
    	System.out.println(details.toString());
        emailService.sendBookingDetails(details);
        return "Email sent successfully";
    }
}
