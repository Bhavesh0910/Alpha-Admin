import React from "react";
import "./FundedAccGraph.scss";
import ReactApexChart from "react-apexcharts";
const FundedAccGraph = () => {
  const options = {
    chart: {
      type: "bar",
      height: 350,
      background: "#fff !important",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    },
    yaxis: {
      title: {
        text: "No. of Funded Accounts",
      },
    },
    fill: {
      opacity: 1,
      colors: ["#04D9FF"], // matching the bar color
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val;
        },
      },
    },
    theme: {
      mode: "dark",
      palette: "palette1",
    },
    grid: {
      show: true,
      borderColor: "#252A29",
    },
    backgroundColor: "#fff !important",
  };

  const series = [
    {
      name: "No. of Funded Accounts",
      data: [50, 100, 75, 50, 100, 150, 200, 50, 75, 100, 100, 25],
    },
  ];
  return (
    <div className="fundedAccGraph_wrapper">
      <div className="header_wrapper">
        <h3>No. of Funded Accounts</h3>
      </div>
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={360}
      />
    </div>
  );
};

export default FundedAccGraph;
