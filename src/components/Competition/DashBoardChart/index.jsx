import React, {useEffect, useState} from "react";
import ReactApexChart from "react-apexcharts";
import "./style.scss";
import {useSelector} from "react-redux";
import moment from "moment";

const DashBoardChart = () => {
  const {compDashboard} = useSelector((state) => state.comp);
  const accountSize = compDashboard?.user?.account_size || [];

  const [chartData, setChartData] = useState({balance: [], equity: [], time: []});

  useEffect(() => {
    if (compDashboard?.user?.balance_equity_history) {
      const data = JSON.parse(compDashboard?.user?.balance_equity_history);
      const res = data?.reduce(
        (acc, item, ind) => {
          acc.balance.push(item.balance);
          acc.equity.push(item.equity);
          acc.time.push(item.time);
          return acc;
        },
        {
          balance: [],
          equity: [],
          time: [],
        },
      );

      setChartData(res);
    }
  }, [compDashboard]);

  const options = {
    chart: {
      height: 350,
      type: "line",
      //   toolbar: {show: false},
      background: "#fff",
    },
    colors: ["#FF7F00", "#4CAF50"],
    dataLabels: {enabled: false},
    stroke: {curve: "smooth"},
    xaxis: {
      type: "datetime",
      categories: chartData?.time || [],
      labels: {style: {colors: "#1E1E1E"}},
    },
    yaxis: {
      labels: {
        style: {colors: "#1E1E1E"},
      },
    },
    tooltip: {
      x: {format: "dd/MM/yy"},
    },
    legend: {
      labels: {colors: "#1E1E1E"},
    },
    grid: {
      show: true,
      borderColor: "#252A29",
    },
  };

  const series = [
    {
      name: "Equity",
      data: chartData.equity || [],
    },
    {
      name: "Balance",
      data: chartData.balance || [],
    },
  ];

  return (
    <div className="dashboard_container">
      <h2>Dashboard</h2>
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        style={{height: "400px", width: "100%"}}
      />
    </div>
  );
};

export default DashBoardChart;
