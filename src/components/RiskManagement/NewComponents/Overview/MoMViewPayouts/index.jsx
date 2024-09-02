import React from "react";
import "./style.scss";
import ReactApexChart from "react-apexcharts";
const MOM_payouts = () => {
  const options = {
    chart: {
      type: "bar",
      height: 350,
      background: "#fff",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      labels: {
        style: {
          colors: "#1E1E1E",
        },
      },
    },
    yaxis: {
      title: {
        text: "MOM view of Payouts",
        style: {
          colors: "#1E1E1E",
        },
      },
      labels: {
        style: {
          colors: "#1E1E1E",
        },
        formatter: (val) => `${val}`,
      },
    },
    fill: {
      opacity: 1,
      colors: ["#04D9FF"], 
    },

    tooltip: {
      trigger: "axis",
    },
    grid: {
      show: true,
      borderColor: "#252A29",
    },
    backgroundColor: "#fff",
  };

  const series = [
    {
      name: "MOM view of Payouts",
      data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120],
    },
  ];

  return (
    <div className="payout_wrapper">
      <div className="payout_header_wrapper">
        <h3>MOM view of Payouts</h3>
      </div>
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={360}
      />
    </div>
  );
};

export default MOM_payouts;
