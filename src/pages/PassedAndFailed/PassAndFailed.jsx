import React from 'react'
import './PassAndFailed.scss'

function PassAndFailed() {
  return (
    <div className='passandfailed_wrapper'>
        <h2 className='page_header'>
        Passed vs Failed
        </h2>

        <div className='box'>
            <div className='row row1'>
              <p></p>
              <div>
              <p>Passed</p>
              </div>
              <div>
              <p>Failed</p>
              </div>
            </div>


            <div className='row row2'>
              <p>Average RR</p>
              <span className='passed'>78</span>
              <span className='failed'>2.2</span>
            </div>


            <div className='row row3'>
              <p>Average Amount of Trades</p>
              <span className='passed'>78</span>
              <span className='failed'>2.2</span>
            </div>

            <div className='row row4'>
              <p>Average RR</p>
              <span className='passed'>78</span>
              <span className='failed'>2.2</span>
            </div>
        </div>
    </div>
  )
}

export default PassAndFailed