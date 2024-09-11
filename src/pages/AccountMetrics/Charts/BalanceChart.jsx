import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { utc_to_eet } from "../../../utils/helpers/string";
import dayjs from "dayjs";
import { Empty } from "antd";

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
        formatter: (value) => dayjs(value).format("DD MMM YY, HH:mm"),
      },
      tickAmount: 7,
    },
    stroke:{
      width: 2
    },
    yaxis: {
      title: {
        text: 'Value',
      },
      tickAmount: 7,
      labels: {
        formatter: (value) => "$" + value.toFixed(2),
      },
    },
    title: {
      text: 'Balance vs Equity',
      align: 'left',
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
      const numberOfLabelsToShow = Math.max(2, Math.min(6, timeLabels.length));

      if (minValue === maxValue) {
        setOptions(prevOptions => ({
          ...prevOptions,
          yaxis: {
            ...prevOptions.yaxis,
            min: minValue - 1000,
            max: minValue + 1000,
            tickAmount: numberOfLabelsToShow,
          },
        }));
      } else {
        const range = maxValue - minValue;
        const interval = Math.ceil(range / 10);

        const yAxisMin = Math.floor(minValue / interval) * interval;
        const yAxisMax = Math.ceil(maxValue / interval) * interval;

        const tickAmount = Math.min(6 , Math.ceil((yAxisMax - yAxisMin) / interval) + 1);

        setOptions(prevOptions => ({
          ...prevOptions,
          yaxis: {
            ...prevOptions.yaxis,
            min: yAxisMin,
            max: yAxisMax,
            tickAmount: tickAmount,
          },
        }));
      }

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

      setOptions(prevOptions => ({
        ...prevOptions,
        xaxis: {
          ...prevOptions.xaxis,
          categories: timeLabels,
        },
      }));
    }
  }, [performanceChart]);

  const isNoData = !performanceChart || performanceChart.length === 0;

  return (
    <div id="chart" style={{ position: 'relative', height: '100%' }}>
      {isNoData ? (
        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Empty description="No Data Available" />
        </div>
      ) : (
        <ReactApexChart options={options} series={series} type="line" height={"100%"} />
      )}
    </div>
  );
};

export default BalanceChart;
