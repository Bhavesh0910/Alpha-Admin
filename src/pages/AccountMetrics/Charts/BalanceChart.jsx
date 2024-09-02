import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { utc_to_eet } from "../../../utils/helpers/string";

const BalanceChart = ({ performanceChart }) => {
  const [series, setSeries] = useState([]);
  const [options, setOptions] = useState({
    chart: {
      id: 'balance-chart',
      type: 'line', 
    },
    xaxis: {
      type: 'category',
      labels: {
        rotate: -45,
      },
      tickAmount: 10,
    },
    yaxis: {
      title: {
        text: 'Value'
      },
      min: 0 
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
