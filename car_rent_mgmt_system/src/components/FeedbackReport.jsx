import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FeedbackReport = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4041/api/feedback')
      .then(response => {
        setFeedbacks(response.data);
      })
      .catch(error => {
        console.error('Error fetching feedback:', error);
      });
  }, []);

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Feedback Report</h3>
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Message</th>
            <th>Rating</th>
            <th>User ID</th>
            <th>Vehicle ID</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map((fb) => (
            <tr key={fb.id}>
              <td>{fb.id}</td>
              <td>{fb.message}</td>
              <td>{fb.rating}</td>
              <td>{fb.user?.userId}</td>
              <td>{fb.vehicle?.vehicleId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeedbackReport;
