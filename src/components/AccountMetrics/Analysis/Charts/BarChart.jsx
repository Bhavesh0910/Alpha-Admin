import React from 'react';
import Chart from 'react-apexcharts';

const BarChart = ({ title, seriesData, categories }) => {
  const options = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar:{
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'flat',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['#04D9FF'],
    },
    fill: {
      type: 'gradient',
      gradient: {
        type: 'vertical',
        shadeIntensity: 1,
        gradientToColors: ['#ffffff'],
        inverseColors: false,
        opacityFrom: 0.34,
        opacityTo: 0,
        stops: [0, 100],
      },
    },
    yaxis: {
      min: -800,
      max: 1200,
    //   title: {
    //     text: 'Values',
    //   },
    },
    xaxis: {
      categories,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val;
        },
      },
    },
  };

  return (
    <div className="bar_chart">
      <h3 className="bar_chart_title">{title}</h3>
      <Chart options={options} series={seriesData} type="bar" height={350} />
    </div>
  );
};

export default BarChart;
