package com.mgmt.entity;

import lombok.Data;

@Data
public class CarHistory {
    private Integer vehicleId;          // Change from Long to Integer
    private String status;
    private String registrationNumber;
    private String variantName;
    private String modelNumber;
    private String fuelType;
    private Double rentPerDay;
    private Integer seatCapacity;
    private Integer year;
    private String companyName;

    public CarHistory() {
    }

    public CarHistory(Integer vehicleId, String status, String registrationNumber, String variantName, String modelNumber,
                      String fuelType, Double rentPerDay, Integer seatCapacity, Integer year, String companyName) {
        this.vehicleId = vehicleId;
        this.status = status;
        this.registrationNumber = registrationNumber;
        this.variantName = variantName;
        this.modelNumber = modelNumber;
        this.fuelType = fuelType;
        this.rentPerDay = rentPerDay;
        this.seatCapacity = seatCapacity;
        this.year = year;
        this.companyName = companyName;
    }
}
