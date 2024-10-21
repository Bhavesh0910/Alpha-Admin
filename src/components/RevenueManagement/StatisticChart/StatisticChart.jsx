import React, { useEffect, useState } from "react";
import "./StatisticChart.scss";
import ReactApexChart from "react-apexcharts";
import { DatePicker, notification } from "antd";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const StatisticChart = ({ setDates, rangePresets  , dates}) => {
  const { chartData } = useSelector((state) => state.revenue);
  const [defaultDates, setDefaultDates] = useState([dayjs().subtract(1, "month"), dayjs()]);
  const [isValidRange, setIsValidRange] = useState(true);
  const [lastValidRange, setLastValidRange] = useState({ startDate: dayjs().subtract(1, "month"), endDate: dayjs() });

  const [data, setData] = useState({
    payoutRequested: [],
    payoutApproved: [],
    dates: [],
  });

  useEffect(() => {
    if (chartData) {
      const payoutReq = chartData.map((item) => item.total_payment_amount || 0);
      const payoutApp = chartData.map((item) => item.paid_profit_shares || 0);
      const dates = chartData.map((item) => item.date || "");

      setData({ payoutRequested: payoutReq, payoutApproved: payoutApp, dates });
    }
  }, [chartData]);

  const series = [
    {
      name: "Payout Requested",
      data: data.payoutRequested,
    },
    {
      name: "Total Amount Paid in Profit Share",
      data: data.payoutApproved,
    },
  ];

  const options = {
    chart: {
      height: 350,
      type: "area",
      toolbar: { show: false },
      background: "#fff",
    },
    colors: ["#FF7F00", "#4CAF50"],
    dataLabels: { enabled: false },
    stroke: { curve: "smooth" },
    xaxis: {
      type: "datetime",
      categories: data?.dates,
      labels: { style: { colors: "#1E1E1E" } },
    },
    yaxis: {
      labels: {
        style: { colors: "#1E1E1E" },
        formatter: (val) => `$${val?.toFixed(2)}`,
      },
    },
    tooltip: {
      x: { format: "dd/MM/yy" },
    },
    legend: {
      labels: { colors: "#1E1E1E" },
    },
    grid: {
      show: true,
      borderColor: "#252A29",
    },
  };


  const onRangeChange = (dates) => {

    if (dates && dates.length === 2) {
      const [startDate, endDate] = dates;

      if (endDate.isAfter(dayjs()) || startDate.isAfter(dayjs())) {
        notification.error({
          message: 'Invalid Date Range',
          description: `The selected date range (${startDate.format("DD/MMM/YYYY")} - ${endDate.format("DD/MMM/YYYY")}) contains future dates. Please select a valid range.`,
        });

        if (lastValidRange) {
          setDefaultDates([lastValidRange.startDate, lastValidRange.endDate]);
          return;
        }

        setDefaultDates(null);
        setIsValidRange(false);
        return;
      }

      setDates(dates);
      setLastValidRange({ startDate, endDate });
      setDefaultDates(dates); 
      setIsValidRange(true);
    } else {
      setDates(null);
      setDefaultDates(null); 
    }
  };


  return (
    <div className="statisticChart_wrapper">
      <div className="header_wrapper">
        <h3>Statistics</h3>
        <div className="chotaCalendar">
          <RangePicker
            presets={rangePresets}
            onChange={onRangeChange} 
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
