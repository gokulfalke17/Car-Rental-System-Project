package com.mgmt.service;

import java.io.IOException;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.mgmt.entity.Variant;
import com.mgmt.entity.Vehicle;

public interface IVariantService {
	public Variant addVariant(Variant variant) throws IOException;
	public List<Variant> getAllVariants();
	public Variant getVariantById(Integer id);
	Page<Variant> getAllVariants(Pageable pageable);
	
	public Variant updateVariant(Integer id, Variant updated);
	public void deleteVariant(Integer id);
	public List<Vehicle> getVehiclesByVariantId(Integer variantId);
	//public Vehicle addVehicleToVariant(Integer variantId, String registrationNumber);
	
	public Vehicle addVehicleToVariant(Integer variantId, String registrationNumber, String status);
	public Vehicle getVehicleById(Integer vehicleId);
	public void deleteVehicleById(Integer vehicleId);
	
	public List<Variant> getAllVehicles();

}
