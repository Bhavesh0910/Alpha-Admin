import React from 'react';
import ReactApexCharts from 'react-apexcharts';
import { Empty } from 'antd'; // Import Empty component
import './RiskInsights.scss';

const RiskInsights = ({ data }) => {
  const {
    risk_per_trade = {},
    concurrent_trades_lots = {},
    lots_per_trade = {},
  } = data || {};

  const trades_and_lots_per_day = data?.["trades_and_lots_per_day "] || {};

  const riskPerTradeData = risk_per_trade?.risk_percent && risk_per_trade?.position
    ? risk_per_trade.risk_percent.map((risk, index) => ({
        x: risk_per_trade.position[index], 
        y: risk
    })) : [];

  const concurrentTradesLotsData = concurrent_trades_lots?.date && concurrent_trades_lots?.lots
    ? concurrent_trades_lots.date.map((date, index) => ({
        x: date, 
        y: concurrent_trades_lots.lots[index]
    })) : [];

  const lotsPerTradeData = lots_per_trade?.date && lots_per_trade?.lots
    ? lots_per_trade.date.map((date, index) => ({
        x: date, 
        y: lots_per_trade.lots[index]
    })) : [];

  const tradesAndLotsPerDayData = trades_and_lots_per_day?.date && trades_and_lots_per_day?.trade && trades_and_lots_per_day?.lots
    ? {
        trades: trades_and_lots_per_day.date.map((date, index) => ({
          x: date, 
          y: trades_and_lots_per_day.trade[index]
        })),
        lots: trades_and_lots_per_day.date.map((date, index) => ({
          x: date, 
          y: trades_and_lots_per_day.lots[index]
        }))
    } : { trades: [], lots: [] };

  const isDataEmpty = (data) => !data || data.length === 0;

  const chartOptions = {
    chart: {
      type: 'line',
      toolbar: {
        show: false
      }
    },
    xaxis: {
      type: 'datetime',
      labels: {
        datetimeUTC: false,
        format: 'dd MMM HH:mm' // Format for the x-axis labels
      }
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    dataLabels: {
      enabled: false
    },
    tooltip: {
      x: {
        format: 'dd MMM HH:mm' // Format for the tooltip
      }
    },
    yaxis: {
      title: {
        text: 'Value'
      }
    },
    legend: {
      position: 'top'
    }
  };

  return (
    <div className="risk_insights">
      {/* Risk Per Trade Chart */}
      <div className="chart_wrapper">
        <h2 className="chart_title">Risk Per Trade</h2>
        <div className="chart">
          {isDataEmpty(riskPerTradeData) ? (
            <Empty description="No Data Available" />
          ) : (
            <ReactApexCharts
              options={chartOptions}
              series={[{ name: 'Risk Percent', data: riskPerTradeData }]}
              type="line"
              height={350}
            />
          )}
        </div>
      </div>

      {/* Concurrent Trades and Lots Chart */}
      <div className="chart_wrapper">
        <h2 className="chart_title">Concurrent Trades and Lots</h2>
        <div className="chart">
          {isDataEmpty(concurrentTradesLotsData) ? (
            <Empty description="No Data Available" />
          ) : (
            <ReactApexCharts
              options={{
                ...chartOptions,
                yaxis: {
                  title: {
                    text: 'Value'
                  }
                }
              }}
              series={[
                { name: 'Trades', data: concurrentTradesLotsData },
                { name: 'Lots', data: concurrentTradesLotsData }
              ]}
              type="line"
              height={350}
            />
          )}
        </div>
      </div>

      {/* Lots Per Trade Chart */}
      <div className="chart_wrapper">
        <h2 className="chart_title">Lots Per Trade</h2>
        <div className="chart">
          {isDataEmpty(lotsPerTradeData) ? (
            <Empty description="No Data Available" />
          ) : (
            <ReactApexCharts
              options={chartOptions}
              series={[{ name: 'Lots', data: lotsPerTradeData }]}
              type="line"
              height={350}
            />
          )}
        </div>
      </div>

      {/* Trades and Lots Per Day Chart */}
      <div className="chart_wrapper">
        <h2 className="chart_title">Trades and Lots Per Day</h2>
        <div className="chart">
          {isDataEmpty(tradesAndLotsPerDayData.trades) && isDataEmpty(tradesAndLotsPerDayData.lots) ? (
            <Empty description="No Data Available" />
          ) : (
            <ReactApexCharts
              options={{
                ...chartOptions,
                stroke: {
                  curve: 'smooth',
                  width: 2,
                },
                xaxis: {
                  ...chartOptions.xaxis,
                  labels: {
                    ...chartOptions.xaxis.labels,
                    format: 'dd MMM HH:mm' // Custom format for x-axis labels
                  }
                },
                legend: {
                  position: 'top'
                }
              }}
              series={[
                { name: 'Trades', data: tradesAndLotsPerDayData.trades },
                { name: 'Lots', data: tradesAndLotsPerDayData.lots }
              ]}
              type="line"
              height={350}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RiskInsights;
