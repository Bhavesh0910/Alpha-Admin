import React from "react";
import ReactApexChart from "react-apexcharts";
import { Empty } from "antd";

const LineChart = ({ data }) => {
  const seriesData = data?.click_stats || [];

  const series = [
    {
      name: "Clicks",
      data: seriesData.map(stat => ({
        x: stat.created_day,  
        y: stat.clicks       
      }))
    }
  ];

  const hasData = seriesData.length > 0;

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
      categories: hasData ? series[0].data.map(item => item.x) : [],
      labels: {
        style: {
          colors: "#000",
        },
        rotate: -45,
        trim: true,
      },
      tickPlacement: 'between'
    },
    yaxis: {
      labels: {
        style: {
          colors: "#000",
        },
        formatter: (value) => {
          return Number.isInteger(value) ? value : '';
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
