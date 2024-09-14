import React, { useState, useEffect } from "react";
import "./SplitChart.scss";
import { formatCurrency } from "../../../utils/helpers/string";
import { Spin } from "antd";


const SplitChart = ({ data , loading }) => {
  const [chartData, setChartData] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (data) {

        const totalAmount = Object.values(data).reduce((acc, value) => acc + value, 0);
        setTotal(totalAmount);
        const formattedData = Object.entries(data).map(([key, value]) => ({
          name: key,
          value,
          percentage: (value / totalAmount) * 100 
        }));
        setChartData(formattedData);
    }
  }, [data]);

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
                key={item.name}
                className="chart-bar"
                style={{ width: `${item.percentage + 40}%`, backgroundColor: getColor(item.name) }}
              >
                <p>
                  <span>{item.name} <span className="percentage">({item.percentage?.toFixed(2)}%)</span></span> {formatCurrency(item.value)}
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
    "Bank Wire": "#36A2EB",
    "WISE": "#6B54C6",
    "N/A": "#b09494"
  };
  return colors[name] || "#CCCCCC";
};

export default SplitChart;
