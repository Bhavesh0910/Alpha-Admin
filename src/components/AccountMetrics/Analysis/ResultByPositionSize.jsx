import React from 'react'
import BarChart from './Charts/BarChart'

function ResultByPositionSize() {

    const categories = ['0.01', '0.05', '0.01', '0.01' , '0.01', '0.01'];
    const seriesData1 = [
      {
        name: 'Result',
        data: [400, 800, -400, 1200 , 400, 800], 
      },
    ];

  return (
    <div className='analysis_box result_by_position_size'>
        <h2 className='standard_heading'>
            Result By Position Size
        </h2>

        <div className='chart_wrapper'>
        <BarChart  seriesData={seriesData1} categories={categories} />

        </div>
      
    </div>
  )
}

export default ResultByPositionSize
