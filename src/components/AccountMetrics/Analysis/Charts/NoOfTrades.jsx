import React, {useState} from "react";
import Chart from "react-apexcharts";

const NoOfTrades = () => {
  const [series, setSeries] = useState([
    {
      name: "Balance",
      data: [0, -500, -200, 300, 700, 400, 900, 1200],
    },
  ]);

  const [activeSeries, setActiveSeries] = useState("Balance");

  const toggleSeries = (seriesName) => {
    setActiveSeries(seriesName);
  };

  const options = {
    chart: {
      type: "line",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    colors: ["#00BFFF"],
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.25,
        gradientToColors: ["#04D9FF"],
        inverseColors: true,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 70, 100],
      },
    },
    xaxis: {
      categories: [0, 6, 12, 18, 24, 30], // X-axis categories
      labels: {
        style: {
          colors: "#000",
        },
      },
    },
    yaxis: {
      min: -800,
      max: 1400,
      labels: {
        style: {
          colors: "#000",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
  };

  const filteredSeries = series.filter((serie) => serie.name === activeSeries);

  return (
    <div className="chart">
      <Chart
        options={options}
        series={filteredSeries}
        type="area"
        height={"100%"}
      />
    </div>
  );
};

export default NoOfTrades;
