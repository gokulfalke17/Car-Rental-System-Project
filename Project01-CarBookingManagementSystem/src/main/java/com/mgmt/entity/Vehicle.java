package com.mgmt.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "vehicles")
@Data
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer vehicleId;

    private String vehicleRegistrationNumber;

    private String status; 
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "variant_id")
    @JsonIgnore
    private Variant variant;
    
}