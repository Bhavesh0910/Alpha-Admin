import React from "react";
import ReactApexChart from "react-apexcharts";
import { Empty } from "antd";

const LineChart = ({ data }) => {
  const seriesData = Array.isArray(data?.series) ? data.series : [];
  const hasData = seriesData.length > 0;

  // Define chart options
  const options = {
    chart: {
      type: "line",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    colors: ["#04D9FF"],
    stroke: {
      curve: "smooth",
      width: 2,
    },
    xaxis: {
      categories: hasData ? seriesData[0].data.map((_, index) => index + 1) : [],
      labels: {
        style: {
          colors: "#000",
        },
        rotate: -45,
        trim: true,
      },
    },
    yaxis: {
      min: hasData ? Math.min(...seriesData[0].data) - 50 : 0,
      max: hasData ? Math.max(...seriesData[0].data) + 50 : 100,
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
      borderColor: '#e7e7e7',
      strokeDashArray: 4,
    },
  };

  const series = hasData ? seriesData : [];

  return (
    <div className="chart" style={{ position: 'relative', height: '100%' }}>
      {hasData ? (
        <ReactApexChart
          options={options}
          series={series}
          type="line"
          height={400}
          width={'100%'}
        />
      ) : (
        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Empty description="No Data Available" />
        </div>
      )}
    </div>
  );
};

export default LineChart;
