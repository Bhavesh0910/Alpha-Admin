import React, {useState, useEffect} from "react";
import ReactApexChart from "react-apexcharts";
import {dollarUS, formatDate, utc_to_eet} from "../../../utils/helpers/string";

const ProfitChart = ({data, ProfitData}) => {
  const [Series, setSeries] = useState([
    {
      name: "Balance",
      type: "line",
      data: [],
    },
  ]);
  const [Options, setOptions] = useState({
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
    colors: ["#FD504F", "#FF9800"],
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
      width: [4, 0],
      curve: "smooth",
    },
    grid: {
      borderColor: "#415672",
      strokeDashArray: 8,
    },
    labels:
      (ProfitData &&
        ProfitData.date &&
        ProfitData.date.map((date_str) => {
          return new Date(new Date(date_str).toLocaleString("en-US", {timeZone: "EET"}));
        })) ||
      [],
    xaxis: {
      categories:
        (ProfitData &&
          ProfitData.date &&
          ProfitData.date.map((date_str) => {
            return new Date(new Date(date_str).toLocaleString("en-US", {timeZone: "EET"}));
          })) ||
        [],
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
        formatter: (value) => {
          return formatDate(value);
        },
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
      // tickAmount: 16,
      labels: {
        formatter: (value) => {
          return dollarUS(value);
        },
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
      custom: function ({series, seriesIndex, dataPointIndex, w}) {
        const date = new Date(w.config.Options.labels[dataPointIndex]);
        return (
          '<div class="arrow_box">' +
          '<div class="Annotation-box Red">' +
          "<div>" +
          " Profit : " +
          "</div>" +
          "<span>" +
          series[seriesIndex][dataPointIndex] +
          "</span>" +
          "</div>" +
          '<div class="Annotation-box Date">' +
          "<div>" +
          "</div>" +
          "<span>" +
          `${date.toDateString()} ${date.toLocaleTimeString()}` +
          "</span>" +
          "</div>" +
          "</div>"
        );
      },
    },
  });

  useEffect(() => {
    const profit = ProfitData && Object.keys(ProfitData.profit).map((data) => ProfitData.profit[data]);

    if (ProfitData) {
      setSeries([
        {
          name: "Balance",
          type: "line",
          data: profit,
        },
      ]);

      setOptions({
        Options,
        labels:
          (ProfitData &&
            ProfitData.date &&
            ProfitData.date.map((date_str) => {
              return new Date(new Date(date_str).toLocaleString("en-US", {timeZone: "EET"}));
            })) ||
          [],
      });
    }
  }, [ProfitData]);

  return (
    <div id="chart">
      <ReactApexChart
        options={Options}
        series={Series}
        height={"100%"}
      />
    </div>
  );
};
export default ProfitChart;
