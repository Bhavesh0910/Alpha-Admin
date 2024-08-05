import React, {useState} from "react";
import "./FundingTotalProgress.scss";
const FundingTotalProgress = ({data}) => {
  return (
    <div className="fundingTotalProgress_wrapper">
      <h2>Funding total</h2>
      <div className="total_value">
        <p>${data?.funding_total}</p>
      </div>
      <div className="progress-bar-container">
        <div className="progress-bar">
          <div className="progress-bar-profit"></div>
          <div className="progress-bar-loss"></div>
        </div>{" "}
        <div className="progress-labels">
          <div className="profit_value">
            <p className="value">${data?.total_profit}</p>
            <p
              className="label"
              style={{color: "#5F9D51"}}
            >
              Profit
            </p>
          </div>
          <div className="loss_value">
            <p className="value">-${data?.total_loss}</p>
            <p
              className="label"
              style={{color: "#E92B37"}}
            >
              Loss
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundingTotalProgress;
