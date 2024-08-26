import React, {useEffect, useState} from "react";
import "./StatisticChart.scss";
import ReactApexChart from "react-apexcharts";
import {DatePicker, Select} from "antd";
import {useSelector} from "react-redux";
import dayjs from "dayjs";

const {RangePicker} = DatePicker;

const StatisticChart = ({setDates, rangePresets}) => {
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

  function handleDateChange(dates) {
    if (dates) {
      setDates(dates?.map((item) => item.format("YYYY-MM-DD")));
    } else {
      setDates(null);
    }
  }

  return (
    <div className="statisticChart_wrapper">
      <div className="header_wrapper">
        <h3>Statistics</h3>
        <div className="chotaCalendar">
          <RangePicker
            presets={rangePresets}
            onChange={handleDateChange}
          />
        </div>
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
