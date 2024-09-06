import React from 'react';
import ReactApexCharts from 'react-apexcharts';
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
        datetimeUTC: false
      }
    },
    stroke: {
      curve: 'smooth'
    },
    dataLabels: {
      enabled: false
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy'
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
          <ReactApexCharts
            options={chartOptions}
            series={[{ name: 'Risk Percent', data: riskPerTradeData }]}
            type="line"
            height={350}
          />
        </div>
      </div>

      {/* Concurrent Trades and Lots Chart */}
      <div className="chart_wrapper">
        <h2 className="chart_title">Concurrent Trades and Lots</h2>
        <div className="chart">
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
              { name: 'Trades', data: concurrent_trades_lots?.date && concurrent_trades_lots?.trade
                ? concurrent_trades_lots.date.map((date, index) => ({
                    x: date, 
                    y: concurrent_trades_lots.trade[index]
                  })) 
                : [] },
              { name: 'Lots', data: concurrentTradesLotsData }
            ]}
            type="line"
            height={350}
          />
        </div>
      </div>

      {/* Lots Per Trade Chart */}
      <div className="chart_wrapper">
        <h2 className="chart_title">Lots Per Trade</h2>
        <div className="chart">
          <ReactApexCharts
            options={chartOptions}
            series={[{ name: 'Lots', data: lotsPerTradeData }]}
            type="line"
            height={350}
          />
        </div>
      </div>

      {/* Trades and Lots Per Day Chart */}
      <div className="chart_wrapper">
        <h2 className="chart_title">Trades and Lots Per Day</h2>
        <div className="chart">
          <ReactApexCharts
            options={{
              ...chartOptions,
              stroke: {
                curve: 'smooth'
              },
              yaxis: {
                title: {
                  text: 'Value'
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
        </div>
      </div>
    </div>
  );
};

export default RiskInsights;
