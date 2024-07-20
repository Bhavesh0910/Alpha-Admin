import React from 'react';
import './LongShortBalance.scss';
import TradesIcon from '../../../assets/icons/numoftrades.svg';

const dataBoxes = [
  {
    header: 'No of Trades',
    icon: TradesIcon,
    data: { long: '$278368', short: '$278368' },
  },
  {
    header: 'Results',
    icon: TradesIcon,
    data: { long: '$500000', short: '$300000' },
  },
  {
    header: 'Win Rate',
    icon: TradesIcon,
    data: { long: '$1000', short: '$800' },
  },
  {
    header: 'Average Profit',
    icon: TradesIcon,
    data: { long: '75%', short: '65%' },
  },
  {
    header: 'RRR',
    icon: TradesIcon,
    data: { long: '25%', short: '35%' },
  },
];

const LongShortBalance = () => {
  return (
    <div className='long_short_balance'>
      <div className='analysis_box'>
        <h2 className='standard_heading'>
          Long/Short Balance
        </h2>
        <div className='databox_wrapper'>
          {dataBoxes.map((box, index) => (
            <DataBox key={index} header={box.header} icon={box.icon} data={box.data} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LongShortBalance


const DataBox = ({ header, icon, data }) => {
  return (
    <div className='databox'>
      <div className='db_header'>
        <h3>{header}</h3>
        <img src={icon} alt='' />
      </div>
      <div className='data_wrapper'>
        <h2 className='title long'>
          Long
        </h2>
        <p className='value'>{data.long}</p>
      </div>
      <div className='data_wrapper'>
        <h2 className='title short'>
          Short
        </h2>
        <p className='value'>{data.short}</p>
      </div>
    </div>
  );
};

