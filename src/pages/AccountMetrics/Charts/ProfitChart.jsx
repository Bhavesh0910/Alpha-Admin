import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { dollarUS } from "../../../utils/helpers/string";
import { Empty } from "antd";

const ProfitChart = ({ ProfitData }) => {
  const [series, setSeries] = useState([]);
  const [options, setOptions] = useState({
    plotOptions: {
      bar: {
        borderRadius: 5,
      },
    },
    fill: {
      opacity: [1, 0.5],
      type: ["solid"],
      gradient: {
        type: "vertical",
        shadeIntensity: 0,
        gradientToColors: undefined,
        opacityFrom: 0.8,
        opacityTo: 0.2,
        stops: [0, 90, 100],
      },
    },
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
    colors: ["#FD504F"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      toolbar: {
        show: false,
      },
      height: 350,
      type: "line",
      zoom: {
        enabled: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: [4],
      curve: "smooth",
    },
    grid: {
      borderColor: "#415672",
      strokeDashArray: 8,
    },
    xaxis: {
      categories: [], 
      tickAmount: 15, 
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
        formatter: (value) => value,
        style: {
          colors: "#8B8E93",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      labels: {
        formatter: (value) => {
          console.log(value)
          if (value === 0) return "$0"; 
          return dollarUS(value?.toFixed(2));
        },
        style: {
          colors: "#8B8E93",
          fontSize: "12px",
        },
      },
      min: undefined, 
      max: undefined, 
      tickAmount: undefined, 
    },
    tooltip: {
      style: {
        fontSize: "14px",
        fontWeight: "700",
      },
    },
  });

  const [hasData, setHasData] = useState(true);

  useEffect(() => {
    if (ProfitData) {
      const profit = ProfitData.profit || [];
      const dates = (ProfitData.date || []).map(date_str => date_str.split('T')[0]);

      if (profit.length === 0) {
        setHasData(false);
        setOptions(prevOptions => ({
          ...prevOptions,
          annotations: {
            ...prevOptions.annotations,
            yaxis: [],
            xaxis: [],
            points: [
              {
                x: 0,
                y: 0,
                label: {
                  text: "No Data",
                  style: {
                    color: "#FF4560",
                    background: "#fff",
                    fontSize: "14px",
                    borderRadius: 2,
                    padding: {
                      left: 6,
                      right: 6,
                      top: 3,
                      bottom: 3,
                    },
                  },
                },
              },
            ],
          },
        }));
        setSeries([]);
        return;
      }

      setHasData(true);

      const minProfit = Math.min(...profit);
      const maxProfit = Math.max(...profit);

      const range = maxProfit - minProfit;
      const defaultInterval = 10000; 
      const interval = range / 10 > defaultInterval ? defaultInterval : range / 10;

      const yAxisMin = Math.floor(minProfit / interval) * interval;
      const yAxisMax = Math.ceil(maxProfit / interval) * interval;

      const numTicks = Math.min(5, Math.ceil((yAxisMax - yAxisMin) / interval) - 1);

      setSeries([{
        name: "Profit",
        type: "line",
        data: profit,
      }]);

      setOptions(prevOptions => ({
        ...prevOptions,
        xaxis: {
          ...prevOptions.xaxis,
          categories: dates,
          tickAmount: 6,
        },
        yaxis: {
          ...prevOptions.yaxis,
          min: yAxisMin - interval, 
          max: yAxisMax,
          tickAmount: numTicks, 
        }
      }));
    }
  }, [ProfitData]);

  return (
    <div id="chart">
      {hasData ? (
        <ReactApexChart
          options={options}
          series={series}
          height={"100%"}
        />
      ) : (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Empty description="No Data Available" />
        </div>
      )}
    </div>
  );
};

export default ProfitChart;
