import React from "react";
import Chart from "react-apexcharts";
import "./PaymentChart.scss";
import {formatCurrency} from "../../../utils/helpers/string";

const PaymentChart = ({chartData}) => {
  const options = {
    chart: {
      type: "donut",
    },
    labels: chartData?.labels || [],
    colors: ["#9A60B4", "#315CDE", "#FAC858", "#B2DC9F", "#6B54C6", "#EE6666", "#73C0DE", "#3BA272", "#FC8452", "#FC8452"],
    plotOptions: {
      pie: {
        donut: {
          size: "25%",
        },
        dataLabels: {
          offset: -5,
        },
      },
    },
    dataLabels: {
      formatter(val, opts) {
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
      colors: ["#fff"], // Set border color here
      width: 2, // Set border width here
      dashArray: 0,
    },
  };

  const series = chartData?.series || [];

  return (
    <div className="payoutChart_wrapper">
      <div className="header_wrapper">
        <h2>Payments</h2>
      </div>
      <div id="payoutChart">
        <Chart
          options={options}
          series={series}
          type="donut"
          id="custom_pie_chart"
        />
        <div className="labels_container">
          {chartData?.amounts?.map((amount, index) => (
            <div
              key={index}
              className="label_with_value m2"
            >
              <span className="value piechartamount">{formatCurrency(amount)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentChart;
