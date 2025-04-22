package com.mgmt.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mgmt.entity.Feedback;

@Repository
public interface IFeedbackRepository extends JpaRepository<Feedback, Integer> {
	 List<Feedback> findByUserUserId(Integer userId);
}
	