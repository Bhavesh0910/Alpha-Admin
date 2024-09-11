import { Empty } from 'antd';
import React from 'react';
import ReactApexChart from 'react-apexcharts';

const BarChart = ({ seriesData, categories, title }) => {

  console.log(seriesData)
  const isNoData = !seriesData.length || seriesData.every(series => !series.data.length);

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
        formatter: (value) => value.toFixed(2),
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        endingShape: 'rounded',
        columnWidth: '50%',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['#04D9FF', '#FF8500'],
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
    colors: ['#00BFFF', '#FF4500'],
    legend: {
      position: 'top',
      horizontalAlign: 'left',
    },
  };

  return (
    <div className="bar_chart" style={{ position: 'relative', height: '350px' }}>
      {isNoData ? (
        <div className="no-data-message" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Empty description="No Data Available" />
        </div>
      ) : (
        <ReactApexChart
          options={options}
          series={seriesData}
          type="bar"
          height={350}
        />
      )}
    </div>
  );
};

export default BarChart;
