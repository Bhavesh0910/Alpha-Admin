import React from 'react';
import './ResultByDays.scss';
import BarChart from './Charts/BarChart';

const ResultByDays = ({ data }) => {
  // Extracting categories and series data from the provided data
  const categories = Object.keys(data); // ['Friday', 'Monday', 'Sunday', 'Tuesday']
  
  const seriesData = [
    {
      name: 'Open',
      data: categories?.map(day => data[day]?.open), // [ -2074.12, 49, 328.45, 494.83 ]
    },
    {
      name: 'Close',
      data: categories?.map(day => data[day]?.close), // [ 371.93, 1683.34, 17.4, 3005.19 ]
    },
  ];

  return (
    <div className="analysis_box result_by_days">
      <h2 className="standard_heading">Result By Days</h2>
      <div className="charts_container">
        <div className='chart_wrapper'>
          <BarChart seriesData={[seriesData[0]]} categories={categories}/>
        </div>
        <div className='chart_wrapper'>
          <BarChart seriesData={[seriesData[1]]} categories={categories} />
        </div>
      </div>
    </div>
  );
};

export default ResultByDays;
