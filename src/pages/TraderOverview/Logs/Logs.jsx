import React from 'react'
import ViewLogTable from '../../../components/TraderOverview/ViewLogsTable/ViewLogTable'
import './Logs.scss'

function Logs() {
  return (
    <div className='logs'>
    <Card className='table-wrapper'>
         <ViewLogTable />
    </Card> 
    </div>
     )
}

export default Logs