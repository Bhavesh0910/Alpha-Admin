import {Button, DatePicker, Input, Select} from "antd";
import React from "react";
import "./style.scss";
const CreateCertificate = () => {
  return (
    <div className="create_certificate_container">
      <div className="row1">
        <div className="form_input">
          <label htmlFor="email_id">User Email ID</label>
          <Input placeholder="Type Email ID" />
        </div>
        <div className="form_input">
          <label htmlFor="acc_no">Account Number</label>
          <Select placeholder="Select Account"></Select>
        </div>
      </div>
      <div className="row1">
        <div className="form_input">
          <label htmlFor="certificate_type">Type of Certificate</label>
          <Select placeholder="Choose type certificate"></Select>
        </div>
        <div className="form_input">
          <label htmlFor="payout_amt">Payout Amount</label>
          <Input placeholder="Type Amount (this option is only for payout certificates)" />
        </div>
      </div>
      <div className="row1">
        <div className="form_input">
          <label htmlFor="trader_name">Trader Name</label>
          <Input placeholder="Enter Trader Name" />
        </div>
        <div className="form_input">
          <label htmlFor="date">Date</label>
          <DatePicker placeholder="DD/MM/YYYY" />
        </div>
      </div>

      <div className="create_button_wrapper">
        <Button className="standard_button">Generate</Button>
      </div>
    </div>
  );
};

export default CreateCertificate;
