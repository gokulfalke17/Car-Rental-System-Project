package com.mgmt.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mgmt.entity.Feedback;
import com.mgmt.service.IFeedbackService;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "http://localhost:5173")
public class FeedbackOperationsController {

    @Autowired
    private IFeedbackService feedbackService;

    @PostMapping
    public ResponseEntity<String> submitFeedback(@RequestBody Feedback feedback) {
        String result = feedbackService.submitFeedback(feedback);

        if (result.contains("must complete")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(result);
        } else {
            return ResponseEntity.ok(result);
        }
    }
    
    @GetMapping
    public ResponseEntity<List<Feedback>> getAllFeedback() {
        List<Feedback> feedbackList = feedbackService.getAllFeedbacks();
        return ResponseEntity.ok(feedbackList);
    }
}
