package com.mgmt.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonAlias;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "variant")
public class Variant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonAlias("id") 
    private Integer variantId;  

    private String variantName;
    private String variantDesc;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;
    
    @OneToMany(mappedBy = "variant", fetch = FetchType.LAZY)
    private List<Vehicle> vehicles;

    private String modelNumber;
    private Integer year;
    private String fuelType;

    private Boolean isAc;
    private Integer seatCapacity;
    private Double rentPerDay;
   // private String imageUrl;
    private String imageUrl;
}
