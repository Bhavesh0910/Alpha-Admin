import React from "react";
import Chart from "react-apexcharts";

const BalanceChart = ({ data }) => {
  // Ensure data is an array
  const chartData = Array.isArray(data) ? data : [];

  const options = {
    chart: {
      type: "line",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    colors: ["#00BFFF"],
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.25,
        gradientToColors: ["#04D9FF"],
        inverseColors: true,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 70, 100],
      },
    },
    xaxis: {
      categories: chartData.map((_, index) => index + 1),
      labels: {
        style: {
          colors: "#000",
        },
        rotate: -45,
        trim: true,
      },
      tickAmount: 10, // Show a maximum of 10 ticks
    },
    
    yaxis: {
      min: Math.min(...chartData, 0) - 50, // Set min to the lowest value minus some buffer
      max: Math.max(...chartData, 0) + 50, // Set max to the highest value plus some buffer
      labels: {
        style: {
          colors: "#000",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    
  };

  const series = [
    {
      name: "Balance",
      data: chartData,
    },
  ];

  return (
    <div className="chart">
      <Chart
        options={options}
        series={series}
        type="line"
        height={"100%"}
      />
    </div>
  );
};

export default BalanceChart;
