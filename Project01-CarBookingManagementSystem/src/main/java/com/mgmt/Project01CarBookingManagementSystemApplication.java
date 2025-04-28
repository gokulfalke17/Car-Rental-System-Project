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



/*
 
ALTER TABLE payment
DROP FOREIGN KEY FKqewrl4xrv9eiad6eab3aoja65;

ALTER TABLE payment
ADD CONSTRAINT FKqewrl4xrv9eiad6eab3aoja65
FOREIGN KEY (booking_id)
REFERENCES booking (booking_id)
ON DELETE CASCADE;

ALTER TABLE license
DROP FOREIGN KEY FKuah3uvnrqe0shgk3xp65o838;

ALTER TABLE license
ADD CONSTRAINT FKuah3uvnrqe0shgk3xp65o838
FOREIGN KEY (user_id)
REFERENCES user (user_id)
ON DELETE CASCADE; 
  
*/
