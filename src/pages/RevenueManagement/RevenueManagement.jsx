import React, {useEffect, useState} from "react";
import "./RevenueManagement.scss";
import Infobox from "../../components/RevenueManagement/Infobox/Infobox";
import StatisticChart from "../../components/RevenueManagement/StatisticChart/StatisticChart";
import FundedAccGraph from "../../components/RevenueManagement/FundedAccGraph/FundedAccGraph";
import PayoutPaymentTable from "../../components/RevenueManagement/PayoutPaymentTable/PayoutPaymentTable";
import LoaderOverlay from "../../ReusableComponents/LoaderOverlay";
import {Button, DatePicker} from "antd";
import dayjs from "dayjs";
import {payoutPaymentReq, payoutStatsReq, qualifiedAccountReq, statsReq} from "../../store/NewReducers/revenueMangement";
import {useDispatch, useSelector} from "react-redux";
const {RangePicker} = DatePicker;
const RevenueManagement = () => {
  const [activeTab, setActiveTab] = useState("payments");
  const [pageSize, setPageSize] = useState(10);
  const [pageNo, setPageNo] = useState(1);
  const [dates, setDates] = useState(null);
  const [datesStastics, setDatesStastics] = useState(null);
  const [datesRevenue, setDatesRevenue] = useState(null);
  const {idToken} = useSelector((state) => state.auth);
  const {barDataLoader, chartDataLoader, statsDataLoader} = useSelector((state) => state.revenue);
  const {isLoading} = useSelector((state) => state.payment);

  const dispatch = useDispatch();

  useEffect(() => {
    let query = null;
    if (datesStastics) {
      query = `?start_date=${datesStastics[0]}&end_date=${datesStastics[1]}`;
    }
    dispatch(payoutStatsReq({idToken, dispatch, query}));
  }, [idToken, datesStastics]);

  useEffect(() => {
    let query = null;
    if (datesRevenue) {
      query = `?start_date=${datesRevenue[0]}&end_date=${datesRevenue[1]}`;
    }
    dispatch(qualifiedAccountReq({idToken, dispatch, query}));
  }, [idToken, datesRevenue]);

  useEffect(() => {
    let query = null;
    if (dates) {
      query = `?start_date=${dates[0]}&end_date=${dates[1]}`;
    }
    dispatch(statsReq({idToken, dispatch, query}));
  }, [idToken, dates]);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const onRangeChange = (dates) => {
    if (dates) {
      setDates(dates.map((date) => date.format("YYYY-MM-DD")));
    } else {
      setDates(null);
    }
  };

  const rangePresets = [
    {label: "Last 1 month", value: [dayjs().subtract(1, "month"), dayjs()]},
    {label: "Last 3 months", value: [dayjs().subtract(3, "months"), dayjs()]},
    {label: "Last 6 months", value: [dayjs().subtract(6, "months"), dayjs()]},
    {label: "Last 1 year", value: [dayjs().subtract(1, "year"), dayjs()]},
    {label: "All time", value: [dayjs().subtract(20, "years"), dayjs()]},
  ];
  return (
    <div className="revenueManagement_container">
      {/* {isLoading && <LoaderOver} */}
      <div className="header_wrapper">
        <RangePicker
          presets={rangePresets}
          onChange={onRangeChange}
        />
      </div>
      {(barDataLoader || chartDataLoader || statsDataLoader || isLoading) && <LoaderOverlay />}
      <div className="row1_box">
        <Infobox />
      </div>
      <div className="row2_box">
        <StatisticChart
          setDates={setDatesStastics}
          rangePresets={rangePresets}
        />
        <FundedAccGraph
          setDates={setDatesRevenue}
          rangePresets={rangePresets}
        />
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
        <PayoutPaymentTable activeTab={activeTab} />
      </div>
    </div>
  );
};

export default RevenueManagement;
