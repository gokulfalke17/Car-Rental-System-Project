import React, { useEffect, useRef } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { Card } from "react-bootstrap";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ booked, available }) => {
  const chartRef = useRef();

  const data = {
    labels: ["Booked", "Available"],
    datasets: [
      {
        label: "Car Usage",
        data: [booked, available],
        backgroundColor: ["#FF6384", "#36A2EB"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB"],
        borderWidth: 0,
        hoverOffset: 10
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
            size: 14
          }
        }
      },
      tooltip: {
        bodyFont: {
          size: 14
        },
        titleFont: {
          size: 16
        }
      }
    },
    cutout: '65%'
  };

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return (
    <Card className="shadow-sm p-3" style={{ borderRadius: "12px", height: "100%" }}>
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