import React, { useState } from 'react';
import './ResultByTradeDuration.scss';
import BarChart from './Charts/BarChart';
import AntTable from '../../../ReusableComponents/AntTable/AntTable';

function ResultByTradeDuration({ data }) {

  const [pageSize, setPageSize] = useState(20);
  const [pageNo, setPageNo] = useState(1);

  const hasChartData = data && data.chart && Array.isArray(data.chart.average_profit_loss) && data.chart.average_profit_loss.length > 0;
  const hasTableData = data && data.data && Array.isArray(data.data) && data.data.length > 0;

  const chartData = {
    series: [
      {
        name: 'Average Profit/Loss',
        data: hasChartData ? data.chart.average_profit_loss : [],
      },
    ],
    categories: hasChartData ? data.chart.duration : [], 
  };

  const tableData = hasTableData ? data.data.map((item, index) => ({
    key: index + 1,
    duration: item.Duration,
    numberOfTrades: item.no_of_trade,
    results: item.results,
  })) : []; // Default to empty array if no data

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

  function triggerChange(page, updatedPageSize) {
    setPageNo(page);
    setPageSize(updatedPageSize);
  }

  return (
    <div className='result_by_trade_duration'>
      <div className='analysis_box'>
        <h2 className='standard_heading'>
          Profits in Duration
        </h2>
        <div className='chart_wrapper'>
          <BarChart seriesData={chartData.series} categories={chartData.categories} />
        </div>
      </div>
      <div className='analysis_box'>
        <h2 className='standard_heading'>
          Results by Trade Duration
        </h2>
        <div className='table_wrapper'>
          <AntTable columns={columns} data={tableData}
            totalPages={Math.ceil(tableData.length / pageSize)}
            totalItems={tableData.length}
            pageSize={pageSize}
            CurrentPageNo={pageNo}
            setPageSize={setPageSize}
            triggerChange={triggerChange} />
        </div>
      </div>
    </div>
  );
}

export default ResultByTradeDuration;
