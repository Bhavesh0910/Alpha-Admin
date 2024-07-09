import React from "react";
import "./style.scss";
import { Box, Slider, Tooltip, Typography } from "@mui/material";
import { useSelector } from "react-redux";

function Goals({ data }) {
  const newData = data?.account_metrics?.program_objectives;
  const accountData = useSelector((state) => state.accountList);

  const isTrue = accountData?.data.find(
    (data) => Number(data.login_id) === accountData?.login_id
  );
  const GoalsOverview = [
    {
      heading: "Minimum Trading Days",
      result: newData?.trading_days_status || "N/A",
      minMax: newData?.trading_days || "N/A",
      target: newData?.trading_days_target || "N/A",
      preText: "",
      postText: "days",
      reverseLogic: true,
    },
    {
      heading: "Profit",
      result: newData?.profit_status || "N/A",
      minMax: newData?.profit.toFixed(2) || "N/A",
      target: newData?.profit_target.toFixed(2) || "N/A",
      preText: "$",
      postText: "",
    },
    {
      heading: "Max Total Trailing Loss",
      result: newData?.max_loss_status || "N/A",
      minMax: newData?.max_loss?.toFixed(2) || "N/A",
      target: newData?.max_loss_target?.toFixed(2) || "N/A",
      preText: "$",
      postText: "",
    },
    {
      heading: "Daily loss",
      result: newData?.max_daily_loss_status || "N/A",
      minMax: newData?.max_daily_loss?.toFixed(2) || "N/A",
      target: newData?.max_daily_loss_target?.toFixed(2) || "N/A",
      preText: "$",
      postText: "",
      phase: isTrue?.phase,
    },
    {
      heading:
        "Best day cannot be greater than 40% of your total profits ( Consistency Target)",
      result:
        data?.account_metrics?.calculated_data?.consistency > 40
          ? "failed"
          : "",
      minMax: data?.account_metrics?.calculated_data?.consistency?.toFixed(2),
      target:
        data?.account_metrics?.calculated_data?.consistency >= 100
          ? data?.account_metrics?.calculated_data?.consistency.toFixed(2)
          : 100,
      preText: "",
      postText: "%",
      hideStatusIndicator: true,
      phase: isTrue?.phase,
    },
  ];

  // console.log(isTrue, "isTrueisTrue");
  return (
    <div className="goals box">
      <h2 className="component-heading">Trading Objective</h2>
      {/* <p className='text'>You have successfully passed this phase of your evaluation! You will receive an e-mail with confirmation that your new account has been set up to continue to the next phase.</p> */}

      <div className="goals-box-wrapper">
        {GoalsOverview.map((item) => {
          if (item.phase === "assessment") {
            return null;
          } else {
            return <GoalsBox item={item} />;
          }
        })}
      </div>
    </div>
  );
}

export default Goals;

const GoalsBox = ({ item }) => {
  return (
    <div className="goals-box">
      <div className="goals_container">
        <div className="goals-box-content">
          <h3>{item.heading}</h3>
          <p className="result">
            Result :
            {`${item?.preText || ""} ${item?.minMax} ${item?.postText || ""}`}
          </p>
        </div>
        {item?.hideStatusIndicator ? null : (
          <div className="goals-box-header">
            <div
              className={
                item.result?.toLowerCase() === "passed"
                  ? "pass status-box"
                  : item.result?.toLowerCase() === "in progress"
                  ? " inProgress status-box"
                  : "danger status-box"
              }
            >
              <p>{item.result}</p>
            </div>
          </div>
        )}
      </div>
      <div className="slider-container">
        <div className="sliderMaxValue">
          {`${item?.preText || ""} ${item?.target || ""} ${
            item?.postText || ""
          }`}
        </div>
        <div className="sliderBase">
          <div
            style={{
              width: (Math.abs(item?.minMax) / item?.target) * 100 + "%",
            }}
            className={
              item.result?.toLowerCase() === "passed"
                ? "Passed sliderActive"
                : item.result?.toLowerCase() === "in progress"
                ? "in_Progress sliderActive"
                : item.result?.toLowerCase() === "failed"
                ? "danger sliderActive"
                : "sliderActive"
            }
          >
            <div className="sliderCircle">
              <div className="sliderText">
                {`${item?.preText || ""} ${item?.minMax} ${
                  item?.postText || ""
                }`}
              </div>
              <div className="sliderCircleInner"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// {`${item?.preText || ""} ${
//   item?.result < 0 ? Math.abs(item?.result) : item?.result || ""
// } ${item?.postText || ""}`}
