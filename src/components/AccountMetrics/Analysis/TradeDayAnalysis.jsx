import React from 'react';
import './TradeDayAnalysis.scss';
import BarChart from './Charts/BarChart';
import { formatValue } from '../../../utils/helpers/string';

const DataBox = ({ title, value }) => {
    return (
        <div className='databox'>
            <h3 className='title'>{title}</h3>
            <p className='value'>{value}</p>
        </div>
    );
};

function TradeDayAnalysis({ data }) {
    const categories = [];
    const seriesData1 = [
        {
            name: 'Result',
            data: [],
        },
    ];
    
    console.log(data)

    const dataBoxes = [
        { 
          title: 'Number of Trades', 
          value: formatValue(data?.number_of_trade , 0) 
        },
        { 
          title: 'Positive Days', 
          value: formatValue( data?.positive_days ) 
        },
        { 
          title: 'Average Positive Day', 
          value: formatValue(data?.avg_positive_days ) 
        },
        { 
          title: 'Negative Days', 
          value: formatValue(data?.negative_days ) 
        },
        { 
          title: 'Average Negative Days', 
          value: formatValue(data?.avg_negative_days ) 
        }
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
                    <BarChart seriesData={seriesData1 ?? []} categories={categories ?? []} />
                </div>
            </div>
        </div>
    );
}

export default TradeDayAnalysis;
