import React from "react";
import Chart from "react-apexcharts";
import { Empty } from "antd"; 

const NoOfTrades = ({ data }) => {
  
  const chartData = Array.isArray(data) ? data : [];
  const hasData = chartData.length > 0;

  const options = {
    chart: {
      type: "area",
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
        inverseColors: false, 
        opacityFrom: 0.8,
        opacityTo: 0.3, 
        stops: [0, 70, 100],
      },
    },
    xaxis: {
      categories: hasData ? chartData.map((_, index) => index + 1) : [],
      labels: {
        style: {
          colors: "#000",
        },
        rotate: -45,
        trim: true,
      },
      tickAmount: 10,
    },
    yaxis: {
      min: hasData ? Math.min(...chartData, 0) - 50 : 0,
      max: hasData ? Math.max(...chartData, 0) + 50 : 100,
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
    grid: {
      show: true,
    },
  };

  // Define series
  const series = hasData ? [
    {
      name: "No of Trades",
      data: chartData,
    },
  ] : [];

  return (
    <div className="chart" style={{ position: 'relative', height: '100%' }}>
      {hasData ? (
        <Chart
          options={options}
          series={series}
          type="area"
          height={"100%"}
        />
      ) : (
        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Empty description="No Data Available" />
        </div>
      )}
    </div>
  );
};

export default NoOfTrades;
