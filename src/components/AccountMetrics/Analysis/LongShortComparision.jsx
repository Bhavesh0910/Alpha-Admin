import React from 'react'
import './LongShortComparision.scss'
import BarChart from './Charts/BarChart'

function LongShortComparision() {

    const categories = ['EURJPY.Imax', 'EURJPY.Imax', 'EURJPY.Imax', 'EURJPY.Imax' , 'EURJPY.Imax', 'EURJPY.Imax', 'EURJPY.Imax', ];
    const seriesData1 = [
      {
        name: 'Result',
        data: [400, 800, -400, 1200 , 400, 800, -400], 
      },
    ];

  return (
    <div className='long_short_comparision'>
    <div className='analysis_box'> 
    <h2 className='standard_heading'>
        Long short Comparision
    </h2>
      
      <div className='chart_wrapper'>
      <BarChart  seriesData={seriesData1} categories={categories} />

      </div>
    </div> 

    <div className='analysis_box'>
    <h2 className='standard_heading'>
        Long short Comparision
    </h2>
    </div>
    </div>
  )
}

export default LongShortComparision
