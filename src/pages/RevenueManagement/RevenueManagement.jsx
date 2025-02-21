import React, {useEffect, useState} from "react";
import "./RevenueManagement.scss";
import Infobox from "../../components/RevenueManagement/Infobox/Infobox";
import StatisticChart from "../../components/RevenueManagement/StatisticChart/StatisticChart";
import FundedAccGraph from "../../components/RevenueManagement/FundedAccGraph/FundedAccGraph";
import PayoutPaymentTable from "../../components/RevenueManagement/PayoutPaymentTable/PayoutPaymentTable";
import LoaderOverlay from "../../ReusableComponents/LoaderOverlay";
import {Button, DatePicker, notification} from "antd";
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
  const [defaultDates, setDefaultDates] = useState([dayjs().subtract(1, "month"), dayjs()]);

  const [isValidRange, setIsValidRange] = useState(true);
  const [lastValidRange, setLastValidRange] = useState({ startDate: dayjs().subtract(1, "month"), endDate: dayjs() });

  const dispatch = useDispatch();

  useEffect(() => {
    let query = null;
    if (datesStastics) {
      query = `?start_date=${datesStastics[0].format("YYYY-MM-DD")}&end_date=${datesStastics[1].format("YYYY-MM-DD")}`;
    }
    dispatch(payoutStatsReq({idToken, dispatch, query}));
  }, [idToken, datesStastics]);

  
  useEffect(() => {
    let query = null;
    if (datesRevenue) {
      query = `?start_date=${datesRevenue[0].format("YYYY-MM-DD")}&end_date=${datesRevenue[1].format("YYYY-MM-DD")}`;
    }
    dispatch(qualifiedAccountReq({idToken, dispatch, query}));
  }, [idToken, datesRevenue]);

  useEffect(() => {
    let query = null;
    if (dates) {
      query = `?start_date=${dates[0].format("DD/MMM/YYYY")}&end_date=${dates[1].format("DD/MMM/YYYY")}`;
    }
    dispatch(statsReq({idToken, dispatch, query}));
  }, [idToken, dates]);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const onRangeChange = (dates) => {
      setPageNo(1); 
  
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

  const rangePresets = [
    {label: "Last 1 month", value: [dayjs().subtract(1, "month"), dayjs()]},
    {label: "Last 3 months", value: [dayjs().subtract(3, "months"), dayjs()]},
    {label: "Last 6 months", value: [dayjs().subtract(6, "months"), dayjs()]},
    {label: "Last 1 year", value: [dayjs().subtract(1, "year"), dayjs()]},
    {label: "All time", value: [dayjs().subtract(20, "years"), dayjs()]},
  ];
  return (
    <div className="revenueManagement_container">
      <div className="header_wrapper">
        <RangePicker
          presets={rangePresets}
          value={defaultDates} 
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
          dates={datesStastics}
          rangePresets={rangePresets}
        />
        <FundedAccGraph
        dates={datesRevenue}
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
        <PayoutPaymentTable activeTab={activeTab} dates={dates} />
      </div>
    </div>
  );
};

export default RevenueManagement;
