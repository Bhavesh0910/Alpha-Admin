import React, {useEffect, useState} from "react";
import "./StatisticChart.scss";
import ReactApexChart from "react-apexcharts";
import {Select} from "antd";
import {useSelector} from "react-redux";

const StatisticChart = () => {
  const {chartData} = useSelector((state) => state.revenue);
  const [data, setData] = useState({payoutRequested: [], payoutApproved: [], dates: []});

  useEffect(() => {
    if (chartData) {
      let payoutReq = [];
      let payoutApp = [];
      let dates = [];
      payoutReq = chartData?.map((item) => {
        return item?.total_payment_amount;
      });
      payoutApp = chartData?.map((item) => {
        return item?.paid_profit_shares;
      });
      dates = chartData?.map((item) => {
        return item?.date;
      });
      console.log("payoutReq", payoutReq);
      console.log("payoutApp", payoutApp);
      console.log("dates", dates);
      setData({payoutRequested: payoutReq || [], payoutApproved: payoutApp || [], dates: dates || []});
    }
  }, [chartData]);
  const series = [
    {
      name: "Payout Requested",
      data: data?.payoutRequested || [],
    },
    {
      name: "Total amount paid in profit share",
      data: data?.payoutApproved || [],
    },
  ];

  const options = {
    chart: {
      height: 350,
      type: "area",
      toolbar: {
        show: false,
      },
      background: "#fff",
    },
    colors: ["#FF7F00", "#4CAF50"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      type: "datetime",
      categories: data?.dates,
      labels: {
        style: {
          colors: "#1E1E1E",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#1E1E1E",
        },
        formatter: (val) => `$${val}`,
      },
    },
    tooltip: {
      x: {
        format: "dd/MM/yy",
      },
    },
    legend: {
      labels: {
        colors: "#1E1E1E",
      },
    },
    grid: {
      show: true,
      borderColor: "#252A29",
    },
  };

  return (
    <div className="statisticChart_wrapper">
      <div className="header_wrapper">
        <h3>Statistics</h3>
        {/* <Select
          defaultValue={""}
          className="chart_filter"
          onChange={""}
          options={options}
        /> */}
      </div>
      <ReactApexChart
        options={options}
        series={series}
        type="area"
        height={360}
      />
    </div>
  );
};

export default StatisticChart;
