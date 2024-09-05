import React from "react";
import ReactApexChart from "react-apexcharts";

const LineChart = ({ data }) => {
   
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
    // markers: {
    //   size: 4,
    //   colors: ["#008000"],
    //   strokeColors: "#fff",
    //   strokeWidth: 2,
    //   hover: {
    //     size: 6,
    //   },
    // },
    xaxis: {
      // categories: ["Aug 1", "Aug 2", "Aug 3", "Aug 4", "Aug 5", "Aug 6", "Aug 7", "Aug 8"],
      labels: {
        style: {
          colors: "#000",
        },
        rotate: 0,
        trim: true,
      },
    },
    yaxis: {
      min: 0,
      // max: 1200,
      labels: {
        style: {
          colors: "#000",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      borderColor: "#e7e7e7",
    },
    fill: {
      opacity: 1,
    },
    legend: {
      show: false,
    },
  };

    return (
            <ReactApexChart 
                options={options} 
                series={data?.series || []} 
                type="line" 
                height={400} 
                width={'100%'}
            />
    );
};

export default LineChart;
