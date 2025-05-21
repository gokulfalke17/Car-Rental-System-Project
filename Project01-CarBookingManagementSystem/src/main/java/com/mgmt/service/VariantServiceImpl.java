package com.mgmt.service;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.mgmt.entity.Variant;
import com.mgmt.entity.Vehicle;
import com.mgmt.repository.IVariantRepository;
import com.mgmt.repository.IVehicleRepository;

@Service
public class VariantServiceImpl implements IVariantService {

    @Autowired
    private IVariantRepository variantRepository;

    @Autowired
    private IVehicleRepository vehicleRepository;


    @Override
    public Variant addVariant(Variant variant) throws IOException {
        System.err.println("Saving variant: " + variant);
        
        return variantRepository.save(variant);
    }


    @Override
    public List<Variant> getAllVariants() {
        List<Variant> variants = variantRepository.findAll();
        variants.forEach(variant -> {
            if (variant.getImageUrl() != null && !variant.getImageUrl().isEmpty()) {
                variant.setImageUrl("/uploads/imgs/" + variant.getImageUrl());
            } else {
                variant.setImageUrl(null);
            }
        });
        return variants;
    }


    @Override
    public Variant getVariantById(Integer id) {
        Variant variant = variantRepository.findById(id).orElse(null);
        if (variant != null) {
            if (variant.getImageUrl() != null && !variant.getImageUrl().isEmpty()) {
                variant.setImageUrl("/uploads/imgs/" + variant.getImageUrl());
            } else {
                variant.setImageUrl(null);
            }
            List<Vehicle> vehicles = vehicleRepository.findByVariant(variant);
            variant.setVehicles(vehicles);
        }
        return variant;
    }

    @Override
    public Page<Variant> getAllVariants(Pageable pageable) {
        Page<Variant> variantsPage = variantRepository.findAll(pageable);
        variantsPage.getContent().forEach(variant -> {
            if (variant.getImageUrl() != null && !variant.getImageUrl().isEmpty()) {
                variant.setImageUrl("/uploads/imgs/" + variant.getImageUrl());
            } else {
                variant.setImageUrl(null);
            }
        });
        return variantsPage;
    }

    
    
    @Override
    public Variant updateVariant(Integer id, Variant updated) {
        Variant existing = variantRepository.findById(id).orElse(null);
        if (existing != null) {
            updated.setVariantId(id);
            if (updated.getImageUrl() != null && !updated.getImageUrl().isEmpty()) {
                updated.setImageUrl(updated.getImageUrl()); 
            } else {
                updated.setImageUrl(null);
            }
            return variantRepository.save(updated);
        }
        return null;
    }


    @Override
    public void deleteVariant(Integer id) {
        variantRepository.deleteById(id);
    }


    @Override
    public List<Vehicle> getVehiclesByVariantId(Integer variantId) {
        Variant variant = variantRepository.findById(variantId)
                .orElseThrow(() -> new RuntimeException("Variant Not Found :: " + variantId));
        return vehicleRepository.findByVariant(variant);
    }

    @Override
    public Vehicle addVehicleToVariant(Integer variantId, String registrationNumber, String status) {

        Variant variant = variantRepository.findById(variantId)
                .orElseThrow(() -> new RuntimeException("Variant Not Found :: " + variantId));

        Vehicle vehicle = new Vehicle();
        vehicle.setVehicleRegistrationNumber(registrationNumber);
        vehicle.setStatus(status);
        vehicle.setVariant(variant);

        return vehicleRepository.save(vehicle);
    }


    @Override
    public Vehicle getVehicleById(Integer vehicleId) {
        return vehicleRepository.findById(vehicleId).orElse(null);
    }

    @Override
    public void deleteVehicleById(Integer vehicleId) {
        vehicleRepository.deleteById(vehicleId);
    }

    @Override
    public List<Variant> getAllVehicles() {
        List<Variant> variants = variantRepository.findAll();
        variants.forEach(variant -> {
            if (variant.getImageUrl() != null && !variant.getImageUrl().isEmpty()) {
                variant.setImageUrl("/uploads/imgs/" + variant.getImageUrl());
            } else {
                variant.setImageUrl(null);
            }
        });
        return variants;
    }
}