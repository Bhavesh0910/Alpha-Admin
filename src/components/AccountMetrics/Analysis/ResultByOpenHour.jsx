import React from 'react';
import BarChart from './Charts/BarChart';
import AntTable from '../../../ReusableComponents/AntTable/AntTable';

function ResultByOpenHour({ data }) {
  // Ensure data exists before attempting to access its properties
  const chartData = {
    series: [
      {
        name: 'Average Profit/Loss',
        data: data?.chart_data?.average_profit_loss || [], // Use empty array if data is undefined
      },
    ],
    categories: data?.chart_data?.duration || [], // Use empty array if data is undefined
  };

  const tableData = data?.data?.map((item, index) => ({
    key: index + 1,
    duration: item.Duration,
    numberOfTrades: item.no_of_trade,
    results: item.results,
  })) || []; // Default to empty array if data is undefined

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
    <div className='result_by_open_hour'>
      <div className='analysis_box'>
        <h2 className='standard_heading'>
          Profits by Duration
        </h2>
        <div className='chart_wrapper'>
          <BarChart seriesData={chartData.series} categories={chartData.categories} />
        </div>
      </div>
      <div style={{marginTop:'20px'}} className='analysis_box'>
        <h2 className='standard_heading'>
          Results by Duration
        </h2>
        <div className='table_wrapper'>
          <AntTable columns={columns} data={tableData} />
        </div>
      </div>
    </div>
  );
}

export default ResultByOpenHour;
