import React, { useState, useEffect } from "react";
import "./SplitChart.scss";
import { formatCurrency } from "../../../utils/helpers/string";
import { Spin } from "antd";

const SplitChart = ({ data, loading }) => {
  const [chartData, setChartData] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (data && data.length > 0) {
      const latestDate = data.reduce((latest, current) => {
        return new Date(current.payout_date) > new Date(latest) ? current.payout_date : latest;
      }, data[0].payout_date);

      const latestData = data.filter(item => item.payout_date === latestDate);

      const totalAmount = latestData.reduce((acc, item) => acc + item.amount_of_payout, 0);
      setTotal(totalAmount);

      const formattedData = latestData.map(item => ({
        method: item.method,
        amount_of_payout: item.amount_of_payout,
        percent_change_amount_of_payout: item.percent_change_amount_of_payout,
      }));

      setChartData(formattedData);
    }
  }, [data]);

  console.log(chartData)

  return (
    <div className="splitChart_wrapper">
      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
          <p><Spin /></p>
        </div>
      ) : (
        <>
          <div className="total_value">
            Total split for payment methods
          </div>
          <div className="chart-bar-container">
            {chartData.map((item) => (
              <div
                key={item.method}
                className="chart-bar"
                style={{ width: `${(item.amount_of_payout / total) * 100 + 40}%`, backgroundColor: getColor(item.method) }}
              >
                <p>
                  <span>{item.method} <span className="percentage">({item.percent_change_amount_of_payout?.toFixed(2)}%)</span></span> {formatCurrency(item.amount_of_payout)}
                </p>
              </div>
            ))}
          </div>
          <div className="total_value_right">
            <p>Total</p>
            <span>{formatCurrency(total)}</span>
          </div>
        </>
      )}
    </div>
  );
};

const getColor = (name) => {
  const colors = {
    "RISE": "#EE6666",
    "SWIFT": "#36A2EB",
    "WISE": "#6B54C6",
    "ACH": "#FFD700",
    "N/A": "#b09494"
  };
  return colors[name] || "#CCCCCC";
};

export default SplitChart;
