import React, { useEffect } from "react";
import "./style.scss";
import { DatePicker, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import PieChart from "../../components/RiskManagement/PieChart/PieChart";
import FundingTotalProgress from "../../components/RiskManagement/FundingTotalProgress/FundingTotalProgress";
import AccountProfitChart from "../../components/RiskManagement/AccountProfitChart/AccountProfitChart";
import StageStatisticsChart from "../../components/RiskManagement/StageStatisticsChart/StageStatisticsChart";
import dayjs from "dayjs";
import Stage2Chart from "../../components/RiskManagement/Stage2Chart/Stage2Chart";
import Stage2Statistics from "../../components/RiskManagement/Stage2Statistics/Stage2Statistics";
import { fetchAccountOverviewStats, fetchFundingChart, fetchStageChart } from "../../store/NewReducers/riskSlice";
import LoaderOverlay from "../../ReusableComponents/LoaderOverlay";

const { Title } = Typography;
const { RangePicker } = DatePicker;

function RiskManagement() {
  const dispatch = useDispatch();
  const { accountOverviewData, stage1ChartData, stage2ChartData, fundingChartData ,  isLoading, error } = useSelector((state) => state.risk);
  const idToken = useSelector((state) => state.auth.idToken);

  

  console.log(stage1ChartData, stage2ChartData , fundingChartData)
  const onRangeChange = (dates) => {
    if (dates && idToken) {
      const startDate = dates[0].format("DD MMM YYYY");
      const endDate = dates[1].format("DD MMM YYYY");
      dispatch(fetchAccountOverviewStats({ idToken, startDate, endDate }));
      dispatch(fetchFundingChart({ idToken, startDate, endDate }));
      dispatch(fetchStageChart({ idToken, stage: 1, startDate, endDate }));
      dispatch(fetchStageChart({ idToken, stage: 2, startDate, endDate }));
    }
  };

  const rangePresets = [
    { label: "Last 1 month", value: [dayjs().subtract(1, "month"), dayjs()] },
    { label: "Last 3 months", value: [dayjs().subtract(3, "months"), dayjs()] },
    { label: "Last 6 months", value: [dayjs().subtract(6, "months"), dayjs()] },
    { label: "Last 1 year", value: [dayjs().subtract(1, "year"), dayjs()] },
    { label: "All time", value: [dayjs().subtract(20, "years"), dayjs()] }, // Assuming "All time" covers a very long period
  ];

  useEffect(() => {
    if (idToken) {
      const defaultDates = [dayjs().subtract(1, "month"), dayjs()];
      onRangeChange(defaultDates);
    }
  }, [dispatch, idToken]);

  return (
    <div className="risk_management_wrapper">
      <div className="header_box">
        <Title style={{ color: "#1E1E1E" }} level={4}>
          Admin Overview
        </Title>
        <RangePicker presets={rangePresets} onChange={onRangeChange} />
      </div>
      {isLoading && <LoaderOverlay />}
      <div className="row1_box">
        {accountOverviewData &&
          <>
            <div className="pieChart_container">
              <PieChart data={accountOverviewData?.stage1} />
            </div>
            <div className="pieChart_container">
              <Stage2Chart data={accountOverviewData?.stage2} />
            </div>
          </>
        }
        {/* <div className="fundingTotalProgress_container">
          <FundingTotalProgress data={accountOverviewData?.fundingTotalProgressData} />
        </div> */}
      </div>
      {/* <div className="row2_box">
        <AccountProfitChart data={accountOverviewData?.accountProfitChartData} />
      </div> */}
      {stage1ChartData &&
        <div className="row3_box">
          <StageStatisticsChart data={stage1ChartData} />
        </div>
      }
      {stage2ChartData &&
        <div className="row4_box">
          <Stage2Statistics data={stage2ChartData} />
        </div>
      }
    </div>
  );
}

export default RiskManagement;
