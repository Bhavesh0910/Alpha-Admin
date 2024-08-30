import React, {useEffect, useState} from "react";
import ReactECharts from "echarts-for-react";
import "./AccountProfitChart.scss";
import {useSelector} from "react-redux";

const AccountProfitChart = () => {
  const {fundingChartData} = useSelector((state) => state.risk);
  const [data, setData] = useState({totalProfit: [], totalLoss: [], dates: []});

  useEffect(() => {
    if (fundingChartData) {
      console.log("fundingdata : ", fundingChartData?.result);
      let dates = [];
      let totalProfit = [];
      let totalLoss = [];
      dates = fundingChartData?.result?.map((item) => item?.date);
      totalProfit = fundingChartData?.result?.map((item) => item?.total_profit);
      totalLoss = fundingChartData?.result?.map((item) => item?.total_loss);
      console.log("dates : ", dates);
      console.log("totalProfit : ", totalProfit);
      console.log("totalProfit : ", totalLoss);
      // totalLoss = fundingChartData?.result?.map((item)=>item?.totalLoss));
      setData((prev) => ({totalProfit: totalProfit, totalLoss: totalLoss, dates: dates}));
    }
  }, [fundingChartData]);

  const seriesData1 = {
    name: "Profit",
    type: "line",
    data: data?.totalProfit || [],
    lineStyle: {
      color: "#54e346",
    },
    showSymbol: false,
    itemStyle: {
      color: "#54e346",
    },
  };

  const seriesData2 = {
    name: "Loss",
    type: "line",
    data: data?.totalLoss || [],
    lineStyle: {
      color: "#e35446",
    },
    showSymbol: false,
    itemStyle: {
      color: "#e35446",
    },
  };

  const option = {
    title: {
      left: "center",
      textStyle: {
        color: "#1E1E1E",
      },
    },
    tooltip: {
      trigger: "axis",
      formatter: (params) => {
        const date = params[0]?.axisValue || "";
        const content = params.map((param) => `${param.marker} ${param.seriesName}: $${param.value.toFixed(2)}`).join("<br/>");
        return `<strong>${date}</strong><br/>${content}`;
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: data?.dates || [],
      axisLabel: {
        color: "#1E1E1E",
      },
      axisLine: {
        lineStyle: {
          color: "#1E1E1E",
        },
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        color: "#1E1E1E",
      },
      axisLine: {
        lineStyle: {
          color: "#1E1E1E",
        },
      },
    },
    series: [seriesData1, seriesData2],
    // series: [seriesData1],
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    backgroundColor: "#fff",
  };

  return (
    <div className="accountProfitChart_wrapper">
      <h2>Current Funding Account Profit</h2>
      <ReactECharts
        option={option}
        style={{height: "400px", width: "100%"}}
      />
    </div>
  );
};

export default AccountProfitChart;
