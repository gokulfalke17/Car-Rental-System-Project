package com.mgmt.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.mgmt.entity.BookingDetails;
import com.mgmt.entity.VariantDetails;
import com.mgmt.entity.VariantInfo;
import com.mgmt.repository.IEmailRepository;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailServiceImpl implements IEmailService {

    @Autowired
    private JavaMailSender mailSender;
    
    @Autowired
    private IEmailRepository emailRepository;
    
    private List<VariantDetails> getVariantDetails(String carNumber) {
        return emailRepository.getSpecificData(carNumber);
    }

    @Override
    public void sendBookingDetails(BookingDetails details) {

        // Fetch company name, variant name, and rent per day
    	List<VariantDetails> data = getVariantDetails(details.getCarNumber());
    	
    	if (!data.isEmpty()) {
    	    VariantDetails variant = data.get(0);
    	    details.setCompanyName(variant.getCompanyName());
    	    details.setVehicleName(variant.getVariantName());
    	    details.setPricePerDay(variant.getRentPerDay());
    	}


        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(details.getEmail());
            helper.setSubject("Car Booking Confirmation - Thank You!");

            String body = """
                    <html>
                      <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
                        <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                          
                          <h2 style="color: #2c3e50; text-align: center;"><span style="color: #2980b9;">Car Booking Confirmation</span></h2>
                          <p>Dear <strong>%s</strong>,</p>
                          
                          <p>Thank you for booking with us! Below are your booking details:</p>

                          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />

                          <h4 style="color: #34495e;"><span style="color: #27ae60;">Vehicle Details</span></h4>
                          <ul style="line-height: 1.6;">
                            <li><strong>Car Number ::</strong> %s</li>
                            <li><strong>Company name :: </strong> %s</li>
                            <li><strong>Vehicle name :: </strong> %s</li>            	            
                            <li><strong>Rent Per Day :: </strong> ₹%.2f</li>
                          </ul>

                          <h4 style="color: #34495e;"><span style="color: #e67e22;">Booking Information</span></h4>
                          <ul style="line-height: 1.6;">
                            <li><strong>From ::</strong> %s</li>
                            <li><strong>To ::</strong> %s</li>
                            <li><strong>Total Days ::</strong> %d</li>
                            <li><strong>Payment Mode ::</strong> %s</li>
                            <li><strong>Total Amount ::</strong> ₹%.2f</li>
                          </ul>

                          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />

                          <p style="font-size: 15px;">We look forward to serving you. If you have any questions, feel free to contact our support team.</p>
                          <p style="margin-top: 30px;">Best Regards,<br/><strong>Car Booking Team</strong></p>
                        </div>
                      </body>
                    </html>
                    """.formatted(
                details.getUserName(),
                details.getCarNumber(),
                details.getCompanyName(),
                details.getVehicleName(),
                details.getPricePerDay(),
                details.getFromDate(),
                details.getToDate(),
                details.getNoOfDays(),
                details.getPaymentMode().toUpperCase(),
                details.getAmount()
            );

            System.err.println(details.getCarNumber());

            helper.setText(body, true);
            mailSender.send(message);

        } catch (MessagingException e) {
            System.err.println("Error sending email: " + e.getMessage());
            e.printStackTrace();
        }
    }


	
}
