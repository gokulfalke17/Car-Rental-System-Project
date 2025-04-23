import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ data, colors, isMobile, isTablet }) => {
  const chartData = {
    labels: ['Booked Cars', 'Available Cars'],
    datasets: [
      {
        label: 'Car Usage',
        data: [data.bookedCars, data.availableCars],
        backgroundColor: [colors.accent, colors.success],
        borderColor: [colors.accentDark, colors.successDark],
        borderWidth: 1,
        borderRadius: 4,
        barThickness: isMobile ? 30 : 40,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: colors.dark,
        titleColor: colors.lightest,
        bodyColor: colors.lightest,
        padding: 10,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: colors.lighter,
          drawBorder: false,
        },
        ticks: {
          color: colors.darkLight,
          font: {
            size: isMobile ? 10 : 12,
          },
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: colors.darkLight,
          font: {
            size: isMobile ? 11 : 13,
            weight: '500'
          },
        }
      }
    },
    layout: {
      padding: {
        top: 10,
        right: isMobile ? 10 : 20,
        bottom: 10,
        left: isMobile ? 10 : 20
      }
    },
    barPercentage: 0.6,
    categoryPercentage: 0.8,
  };

  return (
    <div style={{ 
      height: '100%',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{ 
        height: '100%',
        width: isMobile ? '90%' : '70%',
        maxWidth: '600px' 
      }}>
        <Bar 
          data={chartData} 
          options={options} 
          height={null}
          width={null}
        />
      </div>
    </div>
  );
};

export default BarChart;