package com.mgmt.entity;

import lombok.Data;

@Data
public class DashboardData {
	private Integer totalCars;
	private Integer bookedCars;
	private Integer availableCars;
	private Integer feedbackCount;
	private Integer customerCount;
}
