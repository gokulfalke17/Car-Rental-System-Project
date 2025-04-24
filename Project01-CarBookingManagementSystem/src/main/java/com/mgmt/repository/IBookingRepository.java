package com.mgmt.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mgmt.entity.Booking;
import com.mgmt.entity.Booking.BookingStatus;

@Repository
public interface IBookingRepository extends JpaRepository<Booking, Integer> {
	public List<Booking> findByUserUserId(Integer userId);
	
	@Query("SELECT b FROM Booking b WHERE b.user.userId = :userId")
	public List<Booking> findBookingsByUserId(@Param("userId") Integer userId);
	
	public List<Booking> findByUserUserIdAndVehicleVehicleIdAndStatusIn(Integer userId, Integer vehicleId, List<Booking.BookingStatus> statuses);
	
	public int countByStatus(BookingStatus status);

	
}