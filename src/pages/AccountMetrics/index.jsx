import React, { useEffect, useState } from "react";
import "./style.scss";
import TradingGrowth from "../../components/AccountMetrics/TradingGrowth";
import Goals from "../../components/AccountMetrics/Goals";
import AccountsData from "../../components/AccountMetrics/AccountsData";
import KabanBoard from "../../components/AccountMetrics/KanbanCalendar";
import Statistics from "../../components/AccountMetrics/Statistics";
import Select from "react-select";
import TradeReports from "../../components/AccountMetrics/TradeReports";
import CloseTrades from "../../components/AccountMetrics/CloseTrades";
import Calendar from "react-calendar";
import customStyles from "../../utils/customStyles.jsx";
import { useDispatch, useSelector } from "react-redux";
import {
  accountMetrics,
  setLastPayment,
} from "../../store/NewReducers/accountMetrics.js";

import { accountList, setDefaultLoginId } from "../../store/NewReducers/accountList.js";
// import { Tooltip } from "react-tooltip";
import { Badge, Tooltip } from "@mui/material";
import moment from "moment";

// import { returnMessages } from "../../utils/store/reducers/Message";
import LoaderOverlay from "../../ReusableComponents/LoaderOverlay/index.jsx";
import ResetModal from "../../ReusableComponents/ResetModal/index.jsx";
import { FormatUSD } from "../../utils/helpers/string.js";
import { returnErrors } from "../../store/reducers/error.js";
import { resetRebillPayments } from "../../utils/apis/userApi.js";
import RePaymentModal from "../../ReusableComponents/RePaymentModal/RePaymentModal.jsx";
function AccountMetrics() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const accountData = useSelector((state) => state?.accountList);
  const { data, isLoading } = useSelector((state) => state?.accountMetrics);
  const dispatch = useDispatch();
  const { idToken, dates } = useSelector((state) => state?.auth);

  useEffect(() => {
    accountData?.login_id !== null &&
      dispatch(accountMetrics({ id: accountData?.login_id, idToken: idToken }));
    dispatch(setDefaultLoginId(accountData?.login_id));
  }, [dispatch]);

  const options = accountData?.data.map((data) => ({
    label: data.account_name,
    value: data.login_id,
  }));

  const handleChange = (selectedOption) => {
    Number(selectedOption.value) !== accountData?.login_id &&
      dispatch(setDefaultLoginId(selectedOption.value));
    dispatch(accountMetrics({ id: selectedOption.value, idToken: idToken }));
  };
  // console.log(data, "datadata");
  const statusMapping = {
    0: "Active",
    1: "Temporary iolation",
    2: "Violation",
    3: "Inactive",
    4: "Closed",
    5: "GoalAchieved",
    6: "Ineligible",
  };
  const colorClassMapping = {
    0: "status-active",
    1: "status-temporary-violation",
    2: "status-violation",
    3: "status-inactive",
    4: "status-closed",
    5: "status-goal-achieved",
    6: "status-ineligible",
  };
  const statusCode = data?.account_metrics?.get_trading_accounts?.status;
  const colorClass = colorClassMapping[statusCode] || "status-unknown";

  const statusText = statusMapping[statusCode] || "Unknown status";

  const tradingProfits = {};
  // Calculate total profit for each date
  data?.account_metrics?.day_wise_data?.day_stats?.forEach((trade) => {
    const tradeDate = moment(trade?.tradeDate).format("DD-MM-YYYY");
    if (!tradingProfits[tradeDate]) {
      tradingProfits[tradeDate] = 0;
    }
    tradingProfits[tradeDate] = [trade.totalPnL, trade.totalTrades];
  });

  const tileContent = ({ date }) => {
    const currentDate = moment(date).format("DD-MM-YYYY");
    if (tradingProfits[currentDate]) {
      return (
        <div
          style={{
            color: "white",
            position: "absolute",
            bottom: "5px",
            right: "5px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "right",
            alignItems: "right",
          }}
        >
          <span
            style={{
              color:
                tradingProfits[currentDate][0] > 0 ? "##8BFB88" : "##FF9898",
            }}
          >
            {tradingProfits[currentDate][0]} P&L
          </span>
          <span>{tradingProfits[currentDate][1]} Trades</span>
        </div>
      );
    }
    return null;
  };

  const [selectedDateValue, setSelectedDateValue] = useState();

  const handleDateChange = (date) => {
    // const tradeVlaues = data?.account_metrics?.day_wise_data?.day_stats.find(
    //   (item) =>
    //     moment(item.tradeDate).format("DD-MM-YYYY") ===
    //     moment(date).format("DD-MM-YYYY")
    // );
    const tradeVlaues = data?.account_metrics?.data?.filter(
      (item) =>
        moment(item?.tradeDay).format("DD-MM-YYYY") ===
        moment(date).format("DD-MM-YYYY")
    );
    setSelectedDateValue(tradeVlaues);
  };

  const tileClassName = ({ date, view }) => {
    // console.log(date, "date");
    const currentDate = moment(date).format("DD-MM-YYYY");
    const respo = tradingProfits[currentDate];
    if (view === "month") {
      if (respo && respo[0] > 0) {
        return "greenBackground";
      } else if (respo && respo[0] < 0) {
        return "redBackground";
      }
    }
    return null;
  };
  const activeAccount = accountData.data?.find((item) => {
    return Number(item.login_id) === Number(accountData?.login_id);
  });
  const [open, setOpen] = useState(false);
  const resetAccount = () => {
    setOpen(true);
  };
  const [isLoadings, setIsLoadings] = useState(false);
  const [payload, setPayload] = useState({
    payment_method: "stripe",
    payment_type: "reset",
    account_id: data?.login_id,
    promo: "",
  });
  const handleSubmit = async () => {
    setIsLoadings(true);

    try {
      const response = await resetRebillPayments(idToken, payload);

      if (response.status < 399) {
        dispatch(setLastPayment(response?.data?.data?.id));
        window.location.replace(response?.data.url);
      } else {
        dispatch(returnErrors(response.data.detail, 400));
      }
    } catch (error) {
      dispatch(returnErrors(error.message, error.response?.status || 500));
    } finally {
      setIsLoadings(false);
      setOpen(false);
    }
  };

  const [showMore, setShowMore] = useState(false);
  const [openRepay, setOpenRepay] = useState(false);

  return (
    <div className="account-stats">
      {isLoading && <LoaderOverlay />}
      <ResetModal
        open={open}
        setOpen={setOpen}
        isLoading={isLoadings}
        msg="Are you sure you want to reset this account? This action cannot be
            undone."
        handleSubmit={() => {
          setOpen(false);
          setOpenRepay(true);
        }}
      />
      <RePaymentModal
        open={openRepay}
        setOpen={setOpenRepay}
        handleSubmit={handleSubmit}
        isLoading={isLoadings}
        setPayload={setPayload}
        size={""}
        initialAmount={data?.account_metrics?.purchase_price}
        id={data?.login_id}
      />

      <div className="account-stats-header">
        <div className="account-stats-header-Item">
          <p>Account</p>
          <Select
            value={{
              label: activeAccount?.account_name,
              value: activeAccount?.login_id,
            }}
            onChange={handleChange}
            options={options}
            isSearchable={false}
            styles={customStyles}
            className="react_select_container"
            classNamePrefix="react-select"
          />
          <div className={`status-btn ${colorClass}`}>{statusText}</div>
        </div>
        <div className="account-stats-header-Item">
        </div>
        <div className="account-stats-header-Item">
          <p style={{ marginRight: "1rem" }}>Email : {accountData?.data && accountData?.data[0]?.email}</p>

          {activeAccount?.phase === "assessment" &&
            !activeAccount?.is_active &&
            activeAccount?.status.toLowerCase() === "failed" && (
              <div
                className="metrics-button"
                onClick={() => resetAccount(data?.login_id)}
              >
                Reset Account
              </div>
            )}
          <a
            href="https://platform.alpha-futures.com/"
            target="_blank"
            className="metrics-button"
          >
            Launch AlphaTicks
          </a>
        </div>
      </div>
      <TradingGrowth data={data} />
      <div className="marge_container">
        <AccountsData data={data} />
        <Goals data={data} />
      </div>
      <Statistics data={data} />
      {/* <div className="statistics_container">
        <div className="main_container">
          <div className="first_stats">
            <p>
              <span>No. of trades</span>
              <span>
                {data?.account_metrics?.calculated_data?.total_trades}
              </span>
            </p>
            <p>
              <span>Lots</span>
              <span>{data?.account_metrics?.calculated_data?.lots}</span>
            </p>
            <p>
              <span>Win rate</span>
              <span>{data?.account_metrics?.calculated_data?.win_rate}</span>
            </p>
            <p>
              <span>Highest</span>
              <span>{data?.account_metrics?.calculated_data?.highest}</span>
            </p>
            <p>
              <span>Average profit</span>
              <span
                className={
                  data?.account_metrics?.calculated_data?.average_profit > 0
                    ? "positive_value"
                    : "navative_value"
                }
              >
                {data?.account_metrics?.calculated_data?.average_profit}
              </span>
            </p>
          </div>
          <div className="first_stats">
            <p>
              <span>Average loss</span>
              <span
                className={
                  data?.account_metrics?.calculated_data?.average_loss > 0
                    ? "positive_value"
                    : "navative_value"
                }
              >
                {data?.account_metrics?.calculated_data?.average_loss?.toFixed(
                  2
                )}
              </span>
            </p>
            <p>
              <span>Average RRR</span>
              <span>
                {data?.account_metrics?.calculated_data["rrr "]?.toFixed(2)}
              </span>
            </p>
            <p>
              <span>Expectancy</span>
              <span>
                {data?.account_metrics?.calculated_data?.expectancy_ratio?.toFixed(
                  2
                )}
              </span>
            </p>
            <p>
              <span>Profit factor</span>
              <span>
                {data?.account_metrics?.calculated_data?.profit_factor?.toFixed(
                  2
                )}
              </span>
            </p>
            <p>
              <span>Interest</span>
              <span>N/A</span>
            </p>
          </div>
        </div>
        <div className="bottom_con">
          <div className="time_zone">
            <span>Timezone: </span> <span>GMT+0</span>
          </div>
          <div className="last_updated">
            <span>Last Updated :</span>{" "}
            <span>
              {moment(data?.get_trading_accounts?.updatedAt).format(
                "DD-MM-YYYY h:mm:ss"
              )}
            </span>
          </div>
        </div>
      </div> */}
      <CloseTrades data={data?.account_metrics?.data} />
      <div
        className="main_calendar_container"
        style={{
          display: "grid",
          gap: "20px",
          gridTemplateColumns: selectedDateValue && "65% 33%",
        }}
      >
        <Calendar
          className="calendar_container"
          onChange={(e) => handleDateChange(e)}
          tileContent={tileContent}
          tileClassName={tileClassName}
        />
        {selectedDateValue && (
          <div className="selected_trade_con">
            <h4>
              <span>
                {moment(selectedDateValue?.tradeDate).format(
                  "DD-MM-YYYY ( dddd )"
                )}
              </span>
            </h4>
            {selectedDateValue?.map((trade) => {
              return (
                <div
                  className={
                    trade?.pnL > 0
                      ? "profit_con trade_container"
                      : trade?.pnL < 0
                        ? "loss_con trade_container"
                        : "trade_container"
                  }
                >
                  <p>
                    <span>{trade?.symbolId}</span>{" "}
                    <span
                      className={
                        trade?.pnL > 0
                          ? "positive_value"
                          : trade?.pnL < 0
                            ? "negative_value"
                            : ""
                      }
                    >
                      {FormatUSD(trade?.pnL)} P&L
                    </span>
                  </p>
                  <p>{moment(trade.createdAt).format("LTS")}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="show_more_container">
        <span className="line_one">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="431"
            height="2"
            viewBox="0 0 431 2"
            fill="none"
          >
            <path d="M0 1H431" stroke="#414344" />
          </svg>
        </span>
        <button
          onClick={() => {
            setShowMore((pre) => !pre);
            window.scrollTo({
              top: document.documentElement.scrollHeight,
              behavior: "smooth",
            });
          }}
        >
          Show {showMore ? "less" : "more"} Advanced Stats
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M17.5222 9.05127C17.7861 9.31514 17.7861 9.74296 17.5222 10.0068L11.5 16.0291L5.47778 10.0068C5.21391 9.74296 5.21391 9.31514 5.47778 9.05127C5.74165 8.7874 6.16947 8.7874 6.43334 9.05127L11.5 14.1179L16.5667 9.05127C16.8305 8.7874 17.2583 8.7874 17.5222 9.05127Z"
              fill="white"
            />
          </svg>
        </button>
        <span className="line_one">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="431"
            height="2"
            viewBox="0 0 431 2"
            fill="none"
          >
            <path d="M0 1H431" stroke="#414344" />
          </svg>
        </span>
      </div>
      {showMore === true && <TradeReports />}
    </div>
  );
}

export default AccountMetrics;
