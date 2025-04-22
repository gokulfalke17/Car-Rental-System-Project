package com.mgmt.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mgmt.entity.Variant;
import com.mgmt.entity.Vehicle;

public interface IVehicleRepository extends JpaRepository<Vehicle, Integer>{

	public List<Vehicle> findByVariant(Variant variant);

}
