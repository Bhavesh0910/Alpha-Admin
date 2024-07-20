import React from 'react';
import './TradeDayAnalysis.scss';
import BarChart from './Charts/BarChart';

const dataBoxes = [
  { title: 'Number of Days', value: '10' },
  { title: 'Avg no of trades', value: '20' },
  { title: 'Positive Days', value: '30' },
  { title: 'Average Positive Day', value: '40' },
  { title: 'Negative Days', value: '50' },
  { title: 'Average Negative Days', value: '60' }
];

function TradeDayAnalysis() {

    const categories = ['Mon', 'Tue', 'Wed', 'Thu'];
    const seriesData1 = [
      {
        name: 'Result',
        data: [400, 800, -400, 1200], 
      },
    ];
    
  return (
    <div className='trade_day_analysis'>
      <div className='analysis_box'>
        <h2 className='standard_heading'>
          Trading Days Analysis
        </h2>
        <div className='databox_wrapper'>
          {dataBoxes.map((data, index) => (
            <DataBox key={index} title={data.title} value={data.value} />
          ))}
        </div>

  
      </div>

      <div className='analysis_box'>
        <h2 className='standard_heading'>
          Average Profit / Average Loss 
        </h2>

        <div className='chart_wrapper'>
        <BarChart  seriesData={seriesData1} categories={categories} />

        </div>
        </div>
    </div>
  );
}

export default TradeDayAnalysis;



const DataBox = ({ title, value }) => {
    return (
      <div className='databox'>
        <h3 className='title'>{title}</h3>
        <p className='value'>{value}</p>
      </div>
    );
  };
  