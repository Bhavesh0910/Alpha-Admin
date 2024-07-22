import React from 'react';
import './ResultByTradeDuration.scss';
import BarChart from './Charts/BarChart';
import AntTable from '../../../ReusableComponents/AntTable/AntTable';

function ResultByTradeDuration() {
  const categories = ['Mon', 'Tue', 'Wed', 'Thu'];
  const seriesData1 = [
    {
      name: 'Result',
      data: [400, 800, -400, 1200],
    },
  ];

  const columns = [
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Number of Trades',
      dataIndex: 'numberOfTrades',
      key: 'numberOfTrades',
    },
    {
      title: 'Results',
      dataIndex: 'results',
      key: 'results',
      render: (value) => (
        <span style={{ color: value >= 0 ? 'green' : 'red' }}>{value}</span>
      ),
    },
  ];

  const data = [
    {
      key: '1',
      duration: '0-30 mins',
      numberOfTrades: 10,
      results: 300,
    },
    {
      key: '2',
      duration: '30-60 mins',
      numberOfTrades: 15,
      results: -200,
    },
    {
      key: '3',
      duration: '1-2 hours',
      numberOfTrades: 8,
      results: 500,
    },
    {
      key: '4',
      duration: '2-4 hours',
      numberOfTrades: 5,
      results: -100,
    },
  ];

  return (
    <div className='result_by_trade_duration'>
      <div className='analysis_box'>
        <h2 className='standard_heading'>
          Profits in Duration
        </h2>
        <div className='chart_wrapper'>
          <BarChart seriesData={seriesData1} categories={categories} />
        </div>
      </div>
      <div className='analysis_box'>
        <h2 className='standard_heading'>
          Results by Trade Duration
        </h2>
        <div className='table_wrapper'>
        <AntTable columns={columns} data={data} />
        </div>
      </div>
    </div>
  );
}

export default ResultByTradeDuration;
