import React, {useState, useEffect} from "react";
import ReactApexChart from "react-apexcharts";
import {utc_to_eet} from "../../../utils/helpers/string";
// BalanceData;
const BalanceChart = ({PerformanceChart}) => {
  const dummyData = [
    {
      balance: 100000,
      equity: 100000,
      time: "2024-07-19 06:27:00.609012",
    },
  ];

  const [series, setSeries] = useState([
    {
      name: "Equity",
      type: "line",
      data: [103, 20, 50, 30],
    },
    {
      name: "Balance",
      type: "line",
      data: [13, 245, 2, 52],
    },
  ]);
  const [options, setOptions] = useState({
    legend: {
      fontSize: "14px",
      fontWeight: 700,
      labels: {
        colors: "white",
      },
      markers: {
        width: 15,
        height: 15,
      },
    },
    colors: ["#FF9800", "#FD504F"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      toolbar: {
        show: false,
      },
      height: 350,
      type: "line",
      zoom: {
        enabled: false,
      },
      animations: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
    },
    grid: {
      borderColor: "#415672",
      strokeDashArray: 8,
    },
    labels: (dummyData && Object.keys(dummyData).map((data) => utc_to_eet(dummyData[data].time))) || [],
    xaxis: {
      type: "datetime",
      tooltip: {
        enabled: false,
      },
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      labels: {
        show: true,
        style: {
          colors: "#8B8E93",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      type: "numeric",
      labels: {
        style: {
          colors: "#8B8E93",
          fontSize: "12px",
        },
      },
    },
    tooltip: {
      style: {
        fontSize: "14px",
        fontWeight: "700",
      },
      x: {
        show: true,
        formatter: (val) => {
          const date = new Date(val);
          return `${date.toDateString()} ${date.toLocaleTimeString()}`;
        },
      },
    },
  });

  useEffect(() => {
    let balancedata = dummyData && Object.keys(dummyData).map((data) => dummyData[data].balance);
    let equitydata = dummyData && Object.keys(dummyData).map((data) => dummyData[data].equity);

    setOptions({
      ...options,
      labels: (dummyData && Object.keys(dummyData).map((data) => utc_to_eet(dummyData[data].time))) || [],
    });
    setSeries([
      {
        name: "Equity",
        data: equitydata || [],
      },
      {
        name: "Balance",
        data: balancedata || [],
      },
    ]);
  }, []);

  return (
    <div id="chart">
      <ReactApexChart
        options={options}
        series={series}
        height={250}
      />
    </div>
  );
};
export default BalanceChart;
