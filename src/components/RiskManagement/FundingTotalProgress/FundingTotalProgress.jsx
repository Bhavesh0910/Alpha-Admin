import React, {useEffect, useState} from "react";
import "./FundingTotalProgress.scss";
import {useSelector} from "react-redux";
import { formatCurrency } from "../../../utils/helpers/string";

const FundingTotalProgress = ({data}) => {
  const {fundingChartData} = useSelector((state) => state.risk);
  const [fundingStats, setFundingStats] = useState({totalProfit: 0, totalLoss: 0, totalInvestment: 0});

  useEffect(() => {
    if (fundingChartData?.result) {
      const data = fundingChartData?.result?.reduce(
        (acc, item) => {
          acc.totalProfit += item.total_profit;
          acc.totalLoss += item.total_loss;
          acc.totalInvestment += item.total_investment;
          return acc;
        },
        {totalProfit: 0, totalLoss: 0, totalInvestment: 0},
      );

      setFundingStats(data);
    }
  }, [fundingChartData?.result]);

  return (
    <div className="fundingTotalProgress_wrapper">
      <h2>Funding total</h2>
      <div className="total_value">
        <p>{formatCurrency(fundingStats?.totalInvestment)}</p>
      </div>
      <div className="progress-bar-container">
        <div className="progress-bar">
          <div className="progress-bar-profit"></div>
          <div className="progress-bar-loss"></div>
        </div>{" "}
        <div className="progress-labels">
          <div className="profit_value">
            <p
              className="value"
              style={{color: "#5F9D51"}}
            >
              {formatCurrency(fundingStats?.totalProfit)}
            </p>
            <p
              className="label"
              style={{color: "#5F9D51"}}
            >
              Profit
            </p>
          </div>
          <div className="loss_value">
            <p className="value" style={{color: "#E92B37"}}>-{formatCurrency(fundingStats?.totalLoss)}</p>
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
