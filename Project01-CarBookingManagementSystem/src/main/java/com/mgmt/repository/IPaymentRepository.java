package com.mgmt.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mgmt.entity.Payment;

public interface IPaymentRepository extends JpaRepository<Payment, Integer> {

}
