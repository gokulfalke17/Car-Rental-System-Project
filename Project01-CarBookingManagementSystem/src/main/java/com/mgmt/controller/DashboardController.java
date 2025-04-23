package com.mgmt.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mgmt.entity.DashboardData;
import com.mgmt.repository.IDashbordRepository;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

	@Autowired
	private IDashbordRepository dashbordRepository;
	
	@GetMapping("/summary")
	public DashboardData getSummary() {
	    DashboardData data = new DashboardData();
	    data.setTotalCars(dashbordRepository.getTotalCars());
	    data.setBookedCars(dashbordRepository.getBookedCars()); // use correct booked cars count
	    data.setAvailableCars(dashbordRepository.getAvailableCars());
	    data.setFeedbackCount(dashbordRepository.getTotalFeedbacks());
	    data.setCustomerCount(dashbordRepository.getTotalUsers());
	    return data;
	}
}