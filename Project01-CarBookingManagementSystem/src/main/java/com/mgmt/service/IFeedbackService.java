package com.mgmt.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.mgmt.entity.Feedback;

@Service
public interface IFeedbackService {
	
	public String submitFeedback(Feedback feedback);
	public List<Feedback> getAllFeedbacks();

}
