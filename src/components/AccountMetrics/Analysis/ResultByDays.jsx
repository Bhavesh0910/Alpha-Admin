import React from 'react';
import './ResultByDays.scss'
import BarChart from './Charts/BarChart';

const ResultByDays = () => {
  const categories = ['Mon', 'Tue', 'Wed', 'Thu'];
  const seriesData1 = [
    {
      name: 'Result',
      data: [400, 800, -400, 1200], 
    },
  ];
  const seriesData2 = [
    {
      name: 'Result',
      data: [300, 700, -300, 1000], 
    },
  ];

  return (
    <div className="analysis_box result_by_days">
      <h2 className="standard_heading">Result By Days</h2>
      <div className="charts_container">
        <div className='chart_wrapper'>
        <BarChart  seriesData={seriesData1} categories={categories} />
        </div>
        <div className='chart_wrapper'>
        <BarChart  seriesData={seriesData2} categories={categories} />
        </div>
      </div>
    </div>
  );
};

export default ResultByDays;
