import React from "react";
import ReactECharts from "echarts-for-react";
import dayjs from 'dayjs';
import { Empty } from "antd";

const DrawdownChart = ({ drawdownData }) => {
  const getOption = () => {
    if (!drawdownData) {
      return {};
    }

    const drawdowns = drawdownData.draw_down || [];
    const dates = (drawdownData.date || []).map(date_str => dayjs(date_str).format("YYYY/MM/DD,HH:mm")); 

    const maxDrawdown = Math.max(...drawdowns);
    const minDrawdown = Math.min(...drawdowns);
    const range = maxDrawdown - minDrawdown;
    const interval = Math.ceil(range / 4);

    return {
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          const date = dayjs(params[0].name).format("DD MMM YY, HH:mm"); 
          return `${date}<br/>Drawdown: $${params[0].data.toFixed(2)}`;
        }
      },
      grid: {
        left: '6%',
        right: '10%',
        top: '0%',
        bottom: '20%',
      },
      xAxis: {
        type: 'category',
        data: dates,
        axisLabel: {
          rotate: -20,
        },
        boundaryGap: false,
        axisLine: { show: false },
        splitLine: { show: false },
      },
      yAxis: {
        type: 'value',
        name: '',
        min: minDrawdown - 2,
        max: maxDrawdown + 4,
        interval: interval,
        axisLine: { show: false },
        splitLine: { show: true },
      },
      series: [{
        name: 'Drawdown',
        type: 'line',
        areaStyle: { opacity: 0.3 },
        data: drawdowns,
        lineStyle: { normal: { opacity: 0.6 } },
      }]
    };
  };

  const isNoData = !drawdownData || !drawdownData.draw_down || drawdownData.draw_down.length === 0;

  return (
    <div style={{ height: '280px', position: 'relative' }}>
      {isNoData ? (
        <Empty description="No Data Available" />
      ) : (
        <ReactECharts
          option={getOption()}
          style={{ height: '100%', width: '100%' }}
          notMerge={true}
          lazyUpdate={true}
        />
      )}
    </div>
  );
};

export default DrawdownChart;
