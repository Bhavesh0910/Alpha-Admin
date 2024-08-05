import React, {useEffect, useState} from "react";
import "./FundedAccGraph.scss";
import ReactApexChart from "react-apexcharts";
import {useSelector} from "react-redux";
import {color} from "echarts";
const FundedAccGraph = () => {
  const {barData} = useSelector((state) => state.revenue);
  const [data, setData] = useState(new Array(12).fill(0));

  useEffect(() => {
    if (barData && barData.length > 0) {
      const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

      const newData = new Array(12).fill(0);

      barData.forEach((item) => {
        const [monthName, year] = item.month_year.split(" ");
        const monthIndex = month.indexOf(monthName);
        if (monthIndex !== -1) {
          newData[monthIndex] = item.count;
        }
      });

      setData(newData || []);
    }
  }, [barData]);

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
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      labels: {
        style: {
          colors: "#1E1E1E",
        },
      },
    },
    yaxis: {
      title: {
        text: "No. of Funded Accounts",
        style: {
          colors: "#1E1E1E",
        },
      },
      labels: {
        style: {
          colors: "#1E1E1E",
        },
        formatter: (val) => `$${val}`,
      },
    },
    fill: {
      opacity: 1,
      colors: ["#04D9FF"], // matching the bar color
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val;
        },
      },
    },
    theme: {
      mode: "dark",
      palette: "palette1",
    },
    grid: {
      show: true,
      borderColor: "#252A29",
    },
    backgroundColor: "#fff",
  };

  const series = [
    {
      name: "No. of Funded Accounts",
      data: data || [],
    },
  ];
  return (
    <div className="fundedAccGraph_wrapper">
      <div className="header_wrapper">
        <h3>No. of Funded Accounts</h3>
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

export default FundedAccGraph;
