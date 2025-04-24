package com.mgmt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class Project01CarBookingManagementSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(Project01CarBookingManagementSystemApplication.class, args);
	}

}
