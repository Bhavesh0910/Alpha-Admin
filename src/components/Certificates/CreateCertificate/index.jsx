import { Button, Input, Select, message } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./style.scss";
import { createCertificates } from "../../../store/NewReducers/amSlice";

const { Option } = Select;

const CreateCertificate = () => {
  const dispatch = useDispatch();
  const [loginId, setLoginId] = useState("");
  const [certificateType, setCertificateType] = useState("");
  const [platform, setPlatform] = useState("");
  const [payoutAmount, setPayoutAmount] = useState("");
  const { idToken } = useSelector((state) => state.auth);

  const handleGenerate = async () => {
    if (!loginId || !certificateType || !platform || (certificateType === "Profit Split" && !payoutAmount)) {
      message.error("Please fill in all fields");
      return;
    }

    const formData = new FormData();
    formData.append("login_id", loginId);
    formData.append("certificate_type", certificateType);
    formData.append("platform", platform);
    if (certificateType === "Profit Split") {
      formData.append("amount", payoutAmount);
    }

    try {
      await dispatch(createCertificates({ idToken, certificateData: formData })).unwrap();
      setLoginId("");
      setCertificateType("");
      setPlatform("");
      setPayoutAmount("");
    } catch (error) {
      message.error("Failed to create certificate");
    }
  };

  return (
    <div className="create_certificate_container">
      <div className="row1">
        <div className="form_input">
          <label htmlFor="login_id">Login ID</label>
          <Input
            placeholder="Enter Login ID"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
          />
        </div>
        <div className="form_input">
          <label htmlFor="certificate_type">Type of Certificate</label>
          <Select
            placeholder="Choose type certificate"
            value={certificateType}
            onChange={(value) => {
              setCertificateType(value);
              if (value !== "Profit Split") {
                setPayoutAmount(""); // Clear payout amount if not Profit Split
              }
            }}
          >
            <Option value="Stage 1 Pass">Stage 1 Pass</Option>
            <Option value="Stage 2 Pass">Stage 2 Pass</Option>
            <Option value="Profit Split">Profit Split</Option>
            <Option value="Funded Profit">Funded Profit</Option>
          </Select>
        </div>
      </div>
      <div className="row1">
        <div className="form_input">
          <label htmlFor="platform">Platform</label>
          <Select
            placeholder="Choose platform"
            value={platform}
            onChange={(value) => setPlatform(value)}
          >
            <Option value="mt5">MT5</Option>
            <Option value="ctrader">cTrader</Option>
            <Option value="dxtrade">DXTrade</Option>
          </Select>
        </div>
        {certificateType === "Profit Split" && (
          <div className="form_input">
            <label htmlFor="payout_amt">Payout Amount</label>
            <Input
              placeholder="Type Amount"
              value={payoutAmount}
              onChange={(e) => setPayoutAmount(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="create_button_wrapper">
        <Button className="standard_button" onClick={handleGenerate}>
          Generate
        </Button>
      </div>
    </div>
  );
};

export default CreateCertificate;
