// src/components/LineChart.js
import React from 'react';
import Chart from 'react-apexcharts';

const LineChart = () => {
  const options = {
    chart: {
      type: 'line',
      toolbar: false,
      zoom: {
        enabled: true
      }
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 2.701, 
      colors: ['var(--success, #009017)'], 
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    },
    yaxis: {

    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'], 
        opacity: 0.5,
      },
    },
 
  };

  const series = [
    {
      name: 'Sales',
      data: [30, 40, 35, 50, 49, 60, 70],
    },
  ];

  return (
    <div className="line-chart">
      <Chart options={options} series={series} type="line" height="100%" />
    </div>
  );
};

export default LineChart;
