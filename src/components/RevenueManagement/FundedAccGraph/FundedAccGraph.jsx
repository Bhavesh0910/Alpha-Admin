import React, {useEffect, useState} from "react";
import "./FundedAccGraph.scss";
import ReactApexChart from "react-apexcharts";
import {useSelector} from "react-redux";
import {DatePicker} from "antd";
const {RangePicker} = DatePicker;

const FundedAccGraph = ({setDates, rangePresets}) => {
  const {barData} = useSelector((state) => state.revenue);
  const [mainData, setMainData] = useState({dates: [], fundedCount: []});

  useEffect(() => {
    if (barData?.data && barData?.data.length > 0) {
      const monthNames = [];
      const data = [];
      barData?.data.forEach((item) => {
        if (item && item.month_year) {
          const trimmedMonthYear = item.month_year.trim();
          const [monthName, year] = trimmedMonthYear.split(/\s+/);
          monthNames.unshift(`${monthName?.slice(0, 3)} ${year}`);
          data.unshift(item.total_funded_accounts);
        } else {
          console.warn("Invalid item or month:", item);
        }
      });

      setMainData({dates: monthNames, fundedCount: data});
    }
  }, [barData?.data]);

  const options = {
    chart: {
      type: "bar",
      height: 350,
      background: "#fff",
      toolbar: {
        show: true,
        tools: {
          download: false,
          // selection: true,
          // zoom: true,
          // zoomin: true,
          // zoomout: true,
          // pan: false,
          // reset: true,
        },
      },
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
      categories: mainData?.dates || [],
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
      colors: ["#04D9FF"],
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val;
        },
      },
    },
    grid: {
      show: true,
      borderColor: "#252A29",
    },
  };

  const series = [
    {
      name: "No. of Funded Accounts",
      data: mainData?.fundedCount || [],
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
