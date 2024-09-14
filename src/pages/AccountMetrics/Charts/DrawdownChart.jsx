import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { dollarUS } from "../../../utils/helpers/string";
import dayjs from 'dayjs'; 
import { Empty } from "antd";

const DrawdownChart = ({ drawdownData }) => {
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
    colors: ["#00FFBB"], 
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
      tickAmount: 6, 
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
        formatter: (value) => dayjs(value).format("DD MMM YY, HH:mm"), 
        style: {
          colors: "#8B8E93",
          fontSize: "12px",
        },
        rotate: -45, // Increased rotation for better readability
      },
      min: undefined,
      max: undefined,
      tickPlacement: 'between', 
    },
    yaxis: {
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      labels: {
        formatter: (value) => dollarUS(value?.toFixed(2)),
        style: {
          colors: "#8B8E93",
          fontSize: "12px",
        },
      },
      min: undefined, // Will be set dynamically
      max: undefined, // Will be set dynamically
      tickAmount: undefined, // Will be set dynamically
    },
    tooltip: {
      style: {
        fontSize: "14px",
        fontWeight: "700",
      },
    },
  });

  useEffect(() => {
    if (drawdownData) {
      const drawdowns = drawdownData?.draw_down || [];
      const dates = (drawdownData?.date || []).map(date_str => 
        dayjs(date_str).format("DD MMM YY, HH:mm")
      );

      if (drawdowns.length === 0) {
        setSeries([]);
        setOptions(prevOptions => ({
          ...prevOptions,
          xaxis: {
            ...prevOptions.xaxis,
            categories: [],
          },
          yaxis: {
            ...prevOptions.yaxis,
            min: 0,
            max: 100,
            tickAmount: 5,
          },
        }));
        return;
      }

      const minDrawdown = Math.min(...drawdowns);
      const maxDrawdown = Math.max(...drawdowns);

      const range = maxDrawdown - minDrawdown;
      const interval = Math.ceil(range / 10); // Calculate interval dynamically

      const yAxisMin = Math.min(0, minDrawdown - interval); 
      const yAxisMax = Math.max(0, maxDrawdown + interval);

      const numTicks = Math.min(6, Math.ceil((yAxisMax - yAxisMin) / interval)); 

      const numberOfLabelsToShow = drawdowns.length === 1 ? 1 : Math.max(2, Math.min(6, drawdowns.length));
      const step = drawdowns.length > 1 ? Math.floor(dates.length / numberOfLabelsToShow) : 1;

      setSeries([{
        name: "Drawdown",
        type: "line",
        data: drawdowns,
      }]);

      setOptions(prevOptions => ({
        ...prevOptions,
        xaxis: {
          ...prevOptions.xaxis,
          categories: dates.filter((_, index) => index % step === 0),
          tickAmount: numberOfLabelsToShow,
          labels: {
            ...prevOptions.xaxis.labels,
            rotate: -45, // Adjust rotation to prevent overlapping
          },
          min: dates[0],
          max: dates[dates.length - 1],
        },
        yaxis: {
          ...prevOptions.yaxis,
          min: yAxisMin,
          max: yAxisMax,
          tickAmount: numTicks,
        },
      }));
    }
  }, [drawdownData]);

  const isNoData = !drawdownData || !drawdownData.draw_down || drawdownData.draw_down.length === 0;

  return (
    <div id="chart" style={{ position: 'relative' }}>
      {isNoData ? 
        <div className="no-data-message">
          <Empty description="No Data Available" />
        </div>
        :
        <ReactApexChart
          options={options}
          series={series}
          height={"100%"}
        />
      }
    </div>
  );
};

export default DrawdownChart;
