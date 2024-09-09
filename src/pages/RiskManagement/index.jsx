import React, { useEffect, useState } from "react";
import "./style.scss";
import { DatePicker, notification, Typography } from "antd";
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
  const { accountOverviewData, isLoadingFundingdata, isLoadingStage1, isLoadingStats, error } = useSelector((state) => state.risk);
  const idToken = useSelector((state) => state.auth.idToken);
  const [defaultDates, setDefaultDates] = useState([dayjs().subtract(1, "month"), dayjs()]);

  const [isValidRange, setIsValidRange] = useState(true);
  const [lastValidRange, setLastValidRange] = useState({ startDate: dayjs().subtract(1, "month"), endDate: dayjs() });

  const onRangeChange = (dates) => {
    if (dates && idToken) {
      const [startDate, endDate] = dates;

      if (endDate.isAfter(dayjs()) || startDate.isAfter(dayjs())) {
        setIsValidRange(false);
        notification.error({
          message: 'Invalid Date Range',
          description: `The selected date range (${startDate?.format("DD/MMM/YYYY")} - ${endDate?.format("DD/MMM/YYYY")}) contains dates in the future. Please select a valid range.`,
        });

        if (lastValidRange.startDate && lastValidRange.endDate) {
   

          setDefaultDates([lastValidRange.startDate, lastValidRange.endDate]);

          dispatch(fetchAccountOverviewStats({ idToken, startDate: lastValidRange.startDate.format("DD/MMM/YYYY"), endDate: lastValidRange.endDate.format("DD/MMM/YYYY") }));
          dispatch(fetchFundingChart({ idToken, startDate: lastValidRange.startDate.format("DD/MMM/YYYY"), endDate: lastValidRange.endDate.format("DD/MMM/YYYY") }));
          dispatch(fetchStageChart({ idToken, stage: 1, startDate: lastValidRange.startDate.format("DD/MMM/YYYY"), endDate: lastValidRange.endDate.format("DD/MMM/YYYY") }));
          dispatch(fetchStageChart({ idToken, stage: 2, startDate: lastValidRange.startDate.format("DD/MMM/YYYY"), endDate: lastValidRange.endDate.format("DD/MMM/YYYY") }));
        }
        return;
      }

      setIsValidRange(true);

      setLastValidRange({ startDate, endDate });
      setDefaultDates([startDate, endDate]);

      const formattedStartDate = startDate.format("DD/MMM/YYYY");
      const formattedEndDate = endDate.format("DD/MMM/YYYY");

      dispatch(fetchAccountOverviewStats({ idToken, startDate: formattedStartDate, endDate: formattedEndDate }));
      dispatch(fetchFundingChart({ idToken, startDate: formattedStartDate, endDate: formattedEndDate }));
      dispatch(fetchStageChart({ idToken, stage: 1, startDate: formattedStartDate, endDate: formattedEndDate }));
      dispatch(fetchStageChart({ idToken, stage: 2, startDate: formattedStartDate, endDate: formattedEndDate }));
    } else {
      setIsValidRange(true);
      dispatch(fetchAccountOverviewStats({ idToken, startDate: null }));
      dispatch(fetchFundingChart({ idToken, startDate: null }));
      dispatch(fetchStageChart({ idToken, stage: 1, startDate: null }));
      dispatch(fetchStageChart({ idToken, stage: 2, startDate: null }));
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
      onRangeChange(defaultDates);
    }
  }, [dispatch, idToken]);

  return (
    <div className="risk_management_wrapper">
      <div className="header_box">
        <Title
          style={{ color: "#1E1E1E" }}
          level={4}
        >
          Admin Overview
        </Title>
        <RangePicker
          value={defaultDates} // Use value prop to control the picker
          presets={rangePresets}
          onChange={onRangeChange}
        />
      </div>
      {(isLoadingFundingdata || isLoadingStage1 || isLoadingStats) && <LoaderOverlay />}
      <>
        <div className="row1_box">
          <div className="pieChart_container">
            <PieChart data={accountOverviewData?.stage1} />
          </div>
          <div className="pieChart_container">
            <Stage2Chart data={accountOverviewData?.stage2} />
          </div>

          <div className="fundingTotalProgress_container">
            <FundingTotalProgress data={accountOverviewData?.funding_status} />
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
      </>
    </div>
  );
}

export default RiskManagement;
