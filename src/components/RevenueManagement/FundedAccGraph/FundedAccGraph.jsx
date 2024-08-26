import React, {useEffect, useState} from "react";
import "./FundedAccGraph.scss";
import ReactApexChart from "react-apexcharts";
import {useSelector} from "react-redux";
import {color} from "echarts";
import {DatePicker} from "antd";
const {RangePicker} = DatePicker;

const FundedAccGraph = ({setDates, rangePresets}) => {
  const {barData} = useSelector((state) => state.revenue);
  const [data, setData] = useState(new Array(12).fill(0));

  useEffect(() => {
    if (barData && barData.length > 0) {
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

      const newData = new Array(12).fill(0);

      barData.forEach((item) => {
        if (item && item.month) {
          console.log(item.month, "Processing month");

          const [monthName, year] = item.month.split(" ");
          const monthIndex = monthNames.indexOf(monthName);

          if (monthIndex !== -1 && typeof item.count === "number") {
            newData[monthIndex] = item.count;
          } else {
            console.warn(`Invalid month or count: ${monthName}, ${item.count}`);
          }
        } else {
          console.warn("Invalid item or month:", item);
        }
      });

      setData(newData);
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
        formatter: (val) => `${val}`,
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

  function handleDateChange(dates) {
    if (dates) {
      setDates(dates?.map((item) => item.format("YYYY-MM-DD")));
    } else {
      setDates(null);
    }
  }

  return (
    <div className="fundedAccGraph_wrapper">
      <div className="header_wrapper">
        <h3>No. of Funded Accounts</h3>
        <div className="chotaCalendar">
          <RangePicker
            onChange={handleDateChange}
            presets={rangePresets}
          />
        </div>
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
