import React, { useState } from "react";
import "./RevenueManagement.scss";
import Infobox from "../../components/RevenueManagement/Infobox/Infobox";
import StatisticChart from "../../components/RevenueManagement/StatisticChart/StatisticChart";
import FundedAccGraph from "../../components/RevenueManagement/FundedAccGraph/FundedAccGraph";
import PayoutPaymentTable from "../../components/RevenueManagement/PayoutPaymentTable/PayoutPaymentTable";
import { Button, DatePicker } from "antd";
import dayjs from "dayjs";
const { RangePicker } = DatePicker;
const RevenueManagement = () => {
  const [activeTab, setActiveTab] = useState("payments");

  const handleTabChange = (key) => {
    setActiveTab(key);
  };
  const onRangeChange = (dates, dateStrings) => {
    if (dates) {
      console.log("From: ", dates[0], ", to: ", dates[1]);
      console.log("From: ", dateStrings[0], ", to: ", dateStrings[1]);
    } else {
      console.log("Clear");
    }
  };
  const rangePresets = [
    { label: "Last 1 month", value: [dayjs().subtract(1, "month"), dayjs()] },
    { label: "Last 3 months", value: [dayjs().subtract(3, "months"), dayjs()] },
    { label: "Last 6 months", value: [dayjs().subtract(6, "months"), dayjs()] },
    { label: "Last 1 year", value: [dayjs().subtract(1, "year"), dayjs()] },
    { label: "All time", value: [dayjs().subtract(20, "years"), dayjs()] }, // Assuming "All time" covers a very long period
  ];
  return (
    <div className="revenueManagement_container">
      <div className="header_wrapper">
        <RangePicker presets={rangePresets} onChange={onRangeChange} />
      </div>
      <div className="row1_box">
        <Infobox />
      </div>
      <div className="row2_box">
        <StatisticChart />
        <FundedAccGraph />
      </div>
      <div className="row3_box">
        <div className="header_box">
          <div className="header_wrapper">
            <h3>Payments / Payouts</h3>
          </div>
          <div className="table_header_filter">
            <div className="filter_buttons">
              <Button
                className={activeTab === "payments" ? "active" : ""}
                onClick={() => handleTabChange("payments")}
              >
                Payments
              </Button>
              <Button
                className={activeTab === "payouts" ? "active" : ""}
                onClick={() => handleTabChange("payouts")}
              >
                Payouts
              </Button>
            </div>
          </div>
        </div>
        <PayoutPaymentTable />
      </div>
    </div>
  );
};

export default RevenueManagement;
