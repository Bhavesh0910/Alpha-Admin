import React from "react";
import "./PayoutChart.scss";
import Chart from "react-apexcharts";
const PayoutChart = ({chartData}) => {
  const options = {
    chart: {
      type: "pie",
    },
    labels: chartData?.labels || [],
    colors: [
      "#9A60B4",
      "#315CDE",
      "#FAC858",
      "#B2DC9F",
      "#6B54C6",
      "#EE6666",
      "#73C0DE",
      "#3BA272",
      "#FC8452",
      "#FC8452",
    ],

    plotOptions: {
      pie: {
        dataLabels: {
          offset: -5,
        },
      },
    },

    dataLabels: {
      formatter(val, opts) {
        const name = opts.w.globals.labels[opts.seriesIndex];
        // return [name,val.toFixed(1) + "%"];
        return [val.toFixed(1) + "%"];
      },
    },
    legend: {
      show: true,
    },
    stroke: {
      show: true,
      curve: "straight",
      lineCap: "butt",
      colors: undefined,
      width: 2,
      dashArray: 0,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "35%",
        },
      },
    },
  };

  const series = chartData?.series || []; // Dummy data similar to the data in the image

  return (
    <div className="payoutChart_wrapper">
      <div className="header_wrapper">
        <h2>Payouts</h2>
      </div>
      <Chart
        options={options}
        series={series}
        type="pie"
        id="custom_pie_chart"
      />
    </div>
  );
};

export default PayoutChart;
