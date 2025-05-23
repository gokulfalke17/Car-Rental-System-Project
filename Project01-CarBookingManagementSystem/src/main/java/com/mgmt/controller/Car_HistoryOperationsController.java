package com.mgmt.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mgmt.entity.CarHistory;
import com.mgmt.repository.ICar_HistoryRepository;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "http://localhost:5173")
public class Car_HistoryOperationsController {
	
	@Autowired
	private ICar_HistoryRepository car_HistoryRepository;


    @GetMapping
    public List<CarHistory> getAllVehicles() {
        return car_HistoryRepository.findAllVehicles();
    }

    @GetMapping("/booked")
    public List<CarHistory> getBookedVehicles() {
        return car_HistoryRepository.findBookedVehicles();
    }

    @GetMapping("/available")
    public List<CarHistory> getAvailableVehicles() {
        return car_HistoryRepository.findAvailableVehicles();
    }
}
