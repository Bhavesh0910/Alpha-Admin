import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { utc_to_eet } from "../../../utils/helpers/string";
import dayjs from "dayjs";

const BalanceChart = ({ performanceChart }) => {
  const [series, setSeries] = useState([]);
  const [options, setOptions] = useState({
    chart: {
      id: 'balance-chart',
      type: 'line',
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      type: 'category',
      labels: {
        rotate: -20,
        style: {
          fontSize: '10px', 
        },
        formatter: (value) => dayjs(value).format("DD-MM-YYYY")

      },
      tickAmount: 7, 
    },
    yaxis: {
      title: {
        text: 'Value'
      },
      tickAmount: 7, 
      labels: {
        formatter: (value) => value.toFixed(2), 
      },
    },
    title: {
      text: 'Balance vs Equity',
      align: 'left'
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: 'top',
    },
    grid: {
      borderColor: '#e7e7e7',
    },
  });

  useEffect(() => {
    if (performanceChart && performanceChart.length > 0) {
      const balanceData = performanceChart.map((data) => data.balance);
      const equityData = performanceChart.map((data) => data.equity);
      const timeLabels = performanceChart.map((data) => utc_to_eet(data.time));

      const allValues = [...balanceData, ...equityData];
      const minValue = Math.min(...allValues);
      const maxValue = Math.max(...allValues);

      setSeries([
        {
          name: "Equity",
          data: equityData,
        },
        {
          name: "Balance",
          data: balanceData,
        },
      ]);

      setOptions((prevOptions) => ({
        ...prevOptions,
        xaxis: {
          ...prevOptions.xaxis,
          categories: timeLabels,
        },
        yaxis: {
          ...prevOptions.yaxis,
          min: 0,
          max: maxValue + 1000, 
        },
      }));
    }
  }, [performanceChart]);

  return (
    <div id="chart">
      <ReactApexChart options={options} series={series} type="line" height={"100%"} />
    </div>
  );
};

export default BalanceChart;
