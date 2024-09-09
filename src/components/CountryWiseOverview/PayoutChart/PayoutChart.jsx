import React, {useEffect, useState} from "react";
import "./PayoutChart.scss";
import Chart from "react-apexcharts";
import {formatCurrency} from "../../../utils/helpers/string";
const PayoutChart = ({chartData}) => {
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 700);

  const handleResize = () => {
    setIsMobileView(window.innerWidth < 700);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const options = {
    chart: {
      type: "pie",
    },
    labels: chartData?.labels || [],
    colors: ["#9A60B4", "#315CDE", "#FAC858", "#B2DC9F", "#6B54C6", "#EE6666", "#73C0DE", "#3BA272", "#FC8452", "#FC8452"],

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
        return [val.toFixed(1) + "%"];
      },
    },
    legend: {
      show: !isMobileView,
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

  const series = chartData?.series || [];

  return (
    <div className="payoutChart_wrapper">
      <div className="header_wrapper">
        <h2>Payouts</h2>
      </div>
      <div id="payoutChart">
        <Chart
          options={options}
          series={series}
          type="pie"
          id="custom_pie_chart"
        />
        <span className="labels_container mt20">
          {chartData?.amounts?.map((amount, index) => (
            <div
              key={index}
              className="label_with_value"
            >
              <span className="value piechartamount">{formatCurrency(amount)}</span>
            </div>
          ))}
        </span>
        <div className="mobileLabels_container">
          {chartData?.amounts?.map((item, index) => (
            <div
              key={index}
              className="label_with_value"
            >
              <div className="labels">
              <span
                className="circle"
                style={{backgroundColor: options.colors[index]}}
              ></span>
              <span className="label">{chartData?.labels?.[index]}:</span></div>
              <span className="value">{formatCurrency(chartData?.amounts?.[index])}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PayoutChart;
