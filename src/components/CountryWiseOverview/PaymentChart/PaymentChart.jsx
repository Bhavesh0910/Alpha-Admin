import React from "react";
import Chart from "react-apexcharts";
import "./PaymentChart.scss";

const PaymentChart = () => {
  const options = {
    chart: {
      type: "pie",
    },
    labels: ["Japan", "Iceland", "India", "Guinea", "Poland", "Brazil", "Bahrain", "Monaco"],
    colors: ["#9A60B4", "#315CDE", "#FAC858", "#B2DC9F", "#6B54C6", "#EE6666", "#73C0DE", "#3BA272", "#FC8452"],

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
        return [name, val.toFixed(1) + "%"];
      },
    },
    legend: {
      show: true,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "25%",
        },
      },
    },
    stroke: {
      show: true,
      curve: "straight",
      lineCap: "butt",
      colors: ["#fff"], // Set border color here
      width: 2, // Set border width here
      dashArray: 0,
    },
  };

  const series = [20, 18, 15, 14, 12, 10, 8, 3]; // Dummy data similar to the data in the image

  return (
    <div className="paymentChart_wrapper">
      <div className="header_wrapper">
        <h2>Payments</h2>
      </div>
      <Chart
        options={options}
        series={series}
        type="donut"
        id="custom_pie_chart"
      />
    </div>
  );
};

export default PaymentChart;
