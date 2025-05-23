package com.mgmt.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.mgmt.entity.CarHistory;
import com.mgmt.entity.Vehicle;

@Repository
public interface ICar_HistoryRepository extends JpaRepository<Vehicle, Integer> {

	@Query("SELECT new com.mgmt.entity.CarHistory("
			+ "v.vehicleId, v.status, v.vehicleRegistrationNumber, var.variantName, var.modelNumber, "
			+ "var.fuelType, var.rentPerDay, var.seatCapacity, var.year, c.companyName) " + "FROM Vehicle v "
			+ "JOIN v.variant var " + "JOIN var.company c")
	public List<CarHistory> findAllVehicles();

	@Query("SELECT new com.mgmt.entity.CarHistory("
			+ "v.vehicleId, v.status, v.vehicleRegistrationNumber, var.variantName, var.modelNumber, "
			+ "var.fuelType, var.rentPerDay, var.seatCapacity, var.year, c.companyName) " + "FROM Vehicle v "
			+ "JOIN v.variant var " + "JOIN var.company c " + "WHERE v.status = 'booked'")
	public List<CarHistory> findBookedVehicles();

	@Query("SELECT new com.mgmt.entity.CarHistory("
			+ "v.vehicleId, v.status, v.vehicleRegistrationNumber, var.variantName, var.modelNumber, "
			+ "var.fuelType, var.rentPerDay, var.seatCapacity, var.year, c.companyName) " + "FROM Vehicle v "
			+ "JOIN v.variant var " + "JOIN var.company c " + "WHERE v.status = 'available'")
	public List<CarHistory> findAvailableVehicles();
}
