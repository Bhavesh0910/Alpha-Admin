import React from "react";
import "./style.scss";
import {DatePicker, Typography} from "antd";
import PieChart from "../../components/RiskManagement/PieChart/PieChart";
import FundingTotalProgress from "../../components/RiskManagement/FundingTotalProgress/FundingTotalProgress";
import AccountProfitChart from "../../components/RiskManagement/AccountProfitChart/AccountProfitChart";
import StageStatisticsChart from "../../components/RiskManagement/StageStatisticsChart/StageStatisticsChart";
import dayjs from "dayjs";
import Stage2Chart from "../../components/RiskManagement/Stage2Chart/Stage2Chart";
import Stage2Statistics from "../../components/RiskManagement/Stage2Statistics/Stage2Statistics";
const {Title} = Typography;
const {RangePicker} = DatePicker;
function RiskManagement() {
  const onRangeChange = (dates, dateStrings) => {
    if (dates) {
      // console.log("From: ", dates[0], ", to: ", dates[1]);
      // console.log("From: ", dateStrings[0], ", to: ", dateStrings[1]);
    } else {
      // console.log("Clear");
    }
  };

  const rangePresets = [
    {label: "Last 1 month", value: [dayjs().subtract(1, "month"), dayjs()]},
    {label: "Last 3 months", value: [dayjs().subtract(3, "months"), dayjs()]},
    {label: "Last 6 months", value: [dayjs().subtract(6, "months"), dayjs()]},
    {label: "Last 1 year", value: [dayjs().subtract(1, "year"), dayjs()]},
    {label: "All time", value: [dayjs().subtract(20, "years"), dayjs()]}, // Assuming "All time" covers a very long period
  ];

  return (
    <div className="risk_management_wrapper">
      <div className="header_box">
        <Title
          style={{color: "#1E1E1E"}}
          level={4}
        >
          Admin Overview
        </Title>
        <RangePicker
          presets={rangePresets}
          onChange={onRangeChange}
        />
      </div>
      <div className="row1_box">
        <div className="pieChart_container">
          <PieChart />
        </div>
        <div className="pieChart_container">
          <Stage2Chart />
        </div>
        <div className="fundingTotalProgress_container">
          <FundingTotalProgress />
        </div>
      </div>
      <div className="row2_box">
        <AccountProfitChart />
      </div>
      <div className="row3_box">
        <StageStatisticsChart />
      </div>
      <div className="row4_box">
        <Stage2Statistics />
      </div>
    </div>
  );
}

export default RiskManagement;
