package com.mgmt.entity;

import lombok.Data;

@Data
public class BookingDetails {
	private Integer id;
    private String email;
    private String userName;
    private String carNumber;
    private String companyName;
    private String vehicleName;
    private double pricePerDay;
    
    private String fromDate;
    private String toDate;
    private int noOfDays;
    private String paymentMode;
    private double amount;
}
