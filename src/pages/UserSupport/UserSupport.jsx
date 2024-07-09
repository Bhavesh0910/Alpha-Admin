import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Button, Input, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import "./UserSupport.scss";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const { Option } = Select;
const UserSupport = () => {
  const [activeTab, setActiveTab] = useState("change_email");
  const navigate = useNavigate();
  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <div className="userSupport_container">
      <div className="header_wrapper">
        <div className="filter_buttons">
          <Button
            className={activeTab === "change_email" ? "active" : ""}
            onClick={() => handleTabChange("change_email")}
          >
            Change Email
          </Button>
          <Button
            className={activeTab === "request_payout" ? "active" : ""}
            onClick={() => handleTabChange("request_payout")}
          >
            Request Payout
          </Button>
        </div>
        <Button
          onClick={() =>
            navigate(
              activeTab === "change_email"
                ? "changeEmail-logs"
                : "request-payout"
            )
          }
          className="view_logs__btn standard_button"
        >
          View Logs
        </Button>
      </div>
      <div className="userSupportForm_wrapper">
        {activeTab === "change_email" ? <ChangeEmail /> : <ReqPayoutForm />}
        <div className="footer_section">
          <Button className="standard_button">Submit</Button>
        </div>
      </div>
    </div>
  );
};

export default UserSupport;

const ChangeEmail = () => {
  const [selectEmail, setSelectEmail] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleEmailChange = (value) => {
    setSelectEmail(value);
  };

  return (
    <form className="userSupportForm_changeEmail" action="">
      <div className="change_form_inputFields">
        <div className="form_input_box">
          <label htmlFor="current_email">Current Email</label>
          <Select
            className="email_dropdown"
            placeholder="Select Current Password"
            defaultValue=""
            onChange={handleEmailChange}
          >
            <Option value="example">example@acgfuture.com</Option>
          </Select>
        </div>
        <div className="form_input_box">
          <label htmlFor="current_password">Current Password</label>
          <Input.Password
            id="current_password"
            placeholder="Enter Current Password"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </div>
        <div className="form_input_box">
          <label htmlFor="new_email">New Email</label>
          <Input id="new_email" placeholder="Enter New Email" />
        </div>
      </div>
    </form>
  );
};

const ReqPayoutForm = () => {
  const onChange = (e) => {
    console.log("Change:", e.target.value);
  };

  return (
    <form className="userSupportForm_reqPayoutForm" action="">
      <div className="req_form_inputFields">
        <div className="form_input_box">
          <label htmlFor="logIn_id">Log in ID</label>
          <Input id="logIn_id" placeholder="Enter Log in ID" />
        </div>
        <div className="form_input_box">
          <label htmlFor="amount">Amount</label>
          <Input id="amount" placeholder="Enter Amount" />
        </div>
        <div className="form_input_box">
          <label htmlFor="reason">Reason</label>
          <TextArea
            id="reason"
            showCount
            maxLength={100}
            onChange={onChange}
            placeholder="Enter Reason"
            style={{
              height: 93,
              resize: "none",
            }}
          />
        </div>
      </div>
    </form>
  );
};
