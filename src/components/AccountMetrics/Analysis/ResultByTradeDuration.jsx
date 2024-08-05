import React from 'react';
import './ResultByTradeDuration.scss';
import BarChart from './Charts/BarChart';
import AntTable from '../../../ReusableComponents/AntTable/AntTable';

function ResultByTradeDuration({ data }) {
  const chartData = {
    series: [
      {
        name: 'Average Profit/Loss',
        data: data?.chart?.average_profit_loss, 
      },
    ],
    categories: data?.chart?.duration, 
  };

  const tableData = data?.data?.map((item, index) => ({
    key: index + 1,
    duration: item.Duration,
    numberOfTrades: item.no_of_trade,
    results: item.results,
  }));

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
        <span style={{ color: value >= 0 ? 'green' : 'red' }}>{value.toFixed(2)}</span>
      ),
    },
  ];

  return (
    <div className='result_by_trade_duration'>
      <div className='analysis_box'>
        <h2 className='standard_heading'>
          Profits in Duration
        </h2>
        <div className='chart_wrapper'>
          <BarChart seriesData={chartData?.series} categories={chartData?.categories} />
        </div>
      </div>
      <div className='analysis_box'>
        <h2 className='standard_heading'>
          Results by Trade Duration
        </h2>
        <div className='table_wrapper'>
          <AntTable columns={columns} data={tableData} />
        </div>
      </div>
    </div>
  );
}

export default ResultByTradeDuration;
