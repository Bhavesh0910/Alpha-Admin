import React from 'react';
import Chart from 'react-apexcharts';

const BarChart = ({ seriesData, categories, title }) => {
  const options = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false,
      },
    },
    title: {
      text: title,
      align: 'left',
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
      },
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          colors: '#000',
        },
        rotate: -45,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#000',
        },
        formatter: (value) => value.toFixed(2), // Format to 2 decimal places
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        endingShape: 'rounded',
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
        opacityFrom: 0.8,
        opacityTo: 0.5,
        stops: [0, 100],
      },
    },
    colors: ['#00BFFF', '#FF6347'],
    legend: {
      position: 'top',
      horizontalAlign: 'left',
    },
  };

  return (
    <div className="bar_chart">
      <Chart
        options={options}
        series={seriesData}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default BarChart;
