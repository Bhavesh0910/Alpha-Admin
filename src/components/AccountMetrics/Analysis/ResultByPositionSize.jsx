import React from 'react';
import BarChart from './Charts/BarChart';

function ResultByPositionSize({ data }) {
  const isEmpty = !data || Object.keys(data).length === 0;

  const categories = isEmpty ? [] : Object.keys(data);
  const numberOfTrades = isEmpty ? [] : Object.values(data).map(item => item?.number_of_trade || 0);
  const results = isEmpty ? [] : Object.values(data).map(item => item?.results || 0);

  const seriesData = [
    {
      name: 'Number of Trades',
      data: numberOfTrades,
    },
    {
      name: 'Results',
      data: results,
    },
  ];

  return (
    <div className='analysis_box result_by_position_size'>
      <h2 className='standard_heading'>
        Result By Position Size
      </h2>
      <div className='chart_wrapper'>
        <BarChart seriesData={seriesData} categories={categories} />
      </div>
    </div>
  );
}

export default ResultByPositionSize;
