import React, {useState, useRef, useEffect} from "react";
import "./style.scss";
import calendarIcon from "../../../assets/icons/calendar.svg";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import TradingGrowthChart from "./TradingGrowthChart";
import moment from "moment";
import {FormatUSD} from "../../../utils/helpers/string";
import {getBalanceChartRequest} from "../../../utils/apis/accountsApi.js";
import {useSelector} from "react-redux";

function TradingGrowth({data}) {
  const {idToken} = useSelector((state) => state.auth);
  const {login_id} = useSelector((state) => state.accountList);
  const [balanceChart, setBalanceChart] = useState([]);
  const fetchBalanceChartData = async () => {
    try {
      if (login_id !== null) {
        const response = await getBalanceChartRequest(idToken, login_id);
        // console.log(response, "setBalanceChartsetBalanceChart");
        setBalanceChart(response);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchBalanceChartData();
  }, [login_id, idToken]);

  const newData = data?.get_trading_accounts;
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);
  const headerRightRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target) && headerRightRef.current && !headerRightRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleCalendarClick = () => {
    setShowCalendar(!showCalendar);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };
  // console.log(data, "dasssta");
  const legendData = [
    {
      title: "Balance",
      value: data?.account_balance_equity?.balance,
      color: "#8BFB88",
    },
    {
      title: "Profit target",
      value: data?.account_metrics?.get_trading_accounts?.startingBalance + data?.account_metrics?.program_objectives?.profit_target,
      color: "#1E1E1E27A",
    },
    {
      title: "Max loss limit",
      value: data?.account_metrics?.get_trading_accounts?.maximumLoss,
      color: "#FF9898",
    },
  ];

  const infoBoxData = [
    {
      title: "Start Date",
      value: moment(data?.start_date).format("DD-MM-YYYY"),
    },
    {
      title: "Rebill Date",
      value: moment(data?.expiry_date).format("DD-MM-YYYY"),
    },
    {
      title: "Balance",
      value: FormatUSD(data?.account_balance_equity?.balance),
    },
    // { title: "Equity", value: FormatUSD(data?.account_balance_equity?.equity) },
    {title: "Starting Balance", value: FormatUSD(data?.account_metrics?.get_trading_accounts?.startingBalance)},
    // { title: "Status", value: "$6000" },
  ];

  return (
    <div className="trading-growth">
      <div className="trading-growth-left box">
        <div className="trading-growth-header">
          <h2 className="component-heading">Trading Growth Curve</h2>
          {/* <div className="header-right" ref={headerRightRef}>
            <div className="calendar-dates" onClick={handleCalendarClick}>
              {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
            </div>
            <img src={calendarIcon} alt="" onClick={handleCalendarClick} />
          </div> */}
          {showCalendar && (
            <div
              className="calendar-container"
              ref={calendarRef}
            >
              <div>
                <p>From</p>
                <Calendar
                  onChange={handleStartDateChange}
                  value={startDate}
                  className="start-date-calendar"
                />
              </div>
              <div>
                <p>To</p>
                <Calendar
                  onChange={handleEndDateChange}
                  value={endDate}
                  className="end-date-calendar"
                />
              </div>
            </div>
          )}
        </div>

        <div className="trading-growth-chart">
          <div className="chart-legend">
            {legendData.map((item, index) => (
              <div
                className="legend"
                key={index}
              >
                <div>
                  <span
                    style={{background: item.color}}
                    className="circle"
                  ></span>
                  <p className="title">{item.title}</p>
                </div>
                <p className={item?.value > 0 ? "positive_value" : "navative_value"}>{FormatUSD(item.value)}</p>
              </div>
            ))}
          </div>
          <TradingGrowthChart
            balance_chart={balanceChart}
            profit={data?.account_metrics?.get_trading_accounts?.startingBalance + data?.account_metrics?.program_objectives?.profit_target}
            maxLoss={data?.account_metrics?.get_trading_accounts?.maximumLoss}
          />
        </div>
      </div>

      <div className="trading-growth-right">
        {infoBoxData.map((data, index) => (
          <TgInfoBox
            key={index}
            title={data.title}
            value={data.value}
          />
        ))}
      </div>
    </div>
  );
}

export default TradingGrowth;

const TgInfoBox = ({title, value}) => {
  return (
    <div className="tginfobox">
      <p>{title}</p>
      <span className={value < 0 ? "negative-profit" : "positive-profit"}>{value}</span>
    </div>
  );
};
