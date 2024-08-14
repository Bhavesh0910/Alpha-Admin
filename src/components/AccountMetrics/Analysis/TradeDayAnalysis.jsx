import React from 'react';
import './TradeDayAnalysis.scss';
import BarChart from './Charts/BarChart';

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
        { title: 'Number of Trades', value: data?.number_of_trade || '-' },
        { title: 'Positive Days', value: data?.positive_days ? data.positive_days.toFixed(2) : '-' },
        { title: 'Average Positive Day', value: data?.avg_positive_days ? data.avg_positive_days.toFixed(2) : '-' },
        { title: 'Negative Days', value: data?.negative_days ? data.negative_days.toFixed(2) : '-' },
        { title: 'Average Negative Days', value: data?.avg_negative_days ? data.avg_negative_days.toFixed(2) : '-' },
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
                    <BarChart seriesData={seriesData1} categories={categories} />
                </div>
            </div>
        </div>
    );
}

export default TradeDayAnalysis;
