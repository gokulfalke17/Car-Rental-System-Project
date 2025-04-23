package com.mgmt.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.mgmt.entity.Booking;

@Repository
public interface IDashbordRepository extends JpaRepository<Booking, Integer> {

    @Query(value = "SELECT COUNT(vehicle_id) FROM vehicles WHERE status = 'Booked'", nativeQuery = true)
    public Integer getBookedCars();

    @Query(value = "SELECT COUNT(*) FROM vehicles", nativeQuery = true)
    public Integer getTotalCars();

    @Query(value = "SELECT COUNT(*) FROM vehicles WHERE vehicle_id NOT IN (SELECT vehicle_id FROM booking WHERE status = 'Available')", nativeQuery = true)
    public Integer getAvailableCars();

    @Query(value = "SELECT COUNT(*) FROM booking", nativeQuery = true)
    public Integer getTotalBookings();

    @Query(value = "SELECT COUNT(*) FROM feedback", nativeQuery = true)
    public Integer getTotalFeedbacks();

    @Query(value = "SELECT COUNT(*) FROM user", nativeQuery = true)
    public Integer getTotalUsers();
}

