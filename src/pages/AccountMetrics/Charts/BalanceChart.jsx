import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { utc_to_eet } from "../../../utils/helpers/string";

const BalanceChart = ({ performanceChart }) => {
  const [series, setSeries] = useState([]);
  const [options, setOptions] = useState({
  });

  useEffect(() => {
    if (performanceChart && performanceChart.length > 0) {
      const balanceData = performanceChart.map((data) => data.balance);
      const equityData = performanceChart.map((data) => data.equity);
      const timeLabels = performanceChart.map((data) => utc_to_eet(data.time));

      setSeries([
        {
          name: "Equity",
          data: equityData,
        },
        {
          name: "Balance",
          data: balanceData,
        },
      ]);

      setOptions({
        ...options,
        labels: timeLabels,
      });
    }
  }, [performanceChart]);

  return (
    <div id="chart">
      <ReactApexChart options={options} series={series} height={"100%"} />
    </div>
  );
};

export default BalanceChart;
