// Affiliate.js
import React, { useState } from 'react';
import { Radio } from 'antd';
import './Affiliate.scss';
import AffiliateRefList from './AffiliateRefList/AffiliateRefList';
import CommissionPayment from './CommissionPayment/CommissionPayment';
import { useLocation } from 'react-router-dom';
import AffiliateCode from './AffiliateCode/AffiliateCode';

const Affiliate = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const { state } = useLocation();
  const id = state?.id;
// const id = 3
const user_id = state?.user_id

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <AffiliateRefList id={id} user_id={user_id} />;
      case 'codes':
        return <AffiliateCode id={id} user_id={user_id} />
      case 'payment':
        return <CommissionPayment id={id} user_id={user_id} />;
      default:
        return <AffiliateRefList id={id} user_id={user_id} />;
    }
  };

  return (
    <div className="affiliate-container">
      <Radio.Group value={activeSection} onChange={(e) => setActiveSection(e.target.value)}>
        <Radio.Button value="overview">Overview</Radio.Button>
        <Radio.Button value="codes">Affiliate Codes</Radio.Button>
        <Radio.Button value="payment">Commission Payment</Radio.Button>
      </Radio.Group>
      <div className="affiliate-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default Affiliate;
