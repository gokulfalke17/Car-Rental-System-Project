import React, { useEffect, useRef } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { Card } from "react-bootstrap";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ booked, available }) => {
  const chartRef = useRef();

  const total = booked + available;
  const bookedRatio = total ? ((booked / total) * 100).toFixed(1) : 0;
  const availableRatio = total ? ((available / total) * 100).toFixed(1) : 0;

  const data = {
    labels: ["Booked", "Available"],
    datasets: [
      {
        label: "Car Usage",
        data: [booked, available],
        backgroundColor: ["#FF6B6B", "#4BC0C0"],
        hoverBackgroundColor: ["#FF4C4C", "#3BAFAC"],
        borderWidth: 2,
        borderColor: "#fff",
        hoverOffset: 12
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 14,
            family: 'Segoe UI, sans-serif'
          }
        }
      },
      tooltip: {
        bodyFont: {
          size: 14,
          family: 'Segoe UI, sans-serif'
        },
        titleFont: {
          size: 16
        }
      }
    },
    cutout: '60%'
  };

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return (
    <Card 
      className="shadow-sm p-3" 
      style={{ 
        borderRadius: "15px", 
        height: "100%", 
        background: "linear-gradient(145deg, #f0f4ff, #ffffff)" 
      }}
    >
      <div className="mb-3 text-center">
        <h5 className="mb-2" style={{ color: "#343a40" }}>Car Availability Overview</h5>
        <div style={{ fontSize: "14px", color: "#555" }}>
          <div><strong>Total Cars:</strong> {total}</div>
          <div><strong>Booked:</strong> {booked} ({bookedRatio}%)</div>
          <div><strong>Available:</strong> {available} ({availableRatio}%)</div>
        </div>
      </div>
      <div style={{ height: "300px" }}>
        <Pie 
          ref={chartRef} 
          data={data} 
          options={options} 
        />
      </div>
    </Card>
  );
};

export default PieChart;
