import React, {useState} from "react";
import {Breadcrumb, Button, Input, Select, Spin} from "antd";
import {ReactComponent as PercentageIcon} from "../../../assets/icons/precentage_icon_white.svg";
import "./CreateAffiliateCode.scss";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {createAffiliateCode, fetchCodeList} from "../../../store/NewReducers/affiliateSlice";
import axios from "axios";
import {UserSearchReq, baseUrl} from "../../../utils/api/apis";
import {returnErrors} from "../../../store/reducers/error";

const {Option} = Select;

const CreateAffiliateCode = () => {
  const [isSpinner, setIsSpinner] = useState(false);
  const [couponData, setCouponData] = useState({
    email: "",
    code: "",
    percentage: 0,
    percent_repeat: 0,
  });

  const [emailOpts, setEmailOpts] = useState([{label: "", value: ""}]);
  const [isLoading, setIsLoading] = useState(false);
  const idToken = useSelector((state) => state.auth.idToken);
  const createdLink = useSelector((state) => state.affiliate.createdLink);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fetch = async (value) => {
    setIsLoading(true);
    const response = await UserSearchReq(idToken, value);
    setIsLoading(false);
    if (response?.status < 399) {
      let userArray = [];
      response.data.map((item) =>
        userArray.push({
          label: item?.email,
          value: item?.email,
        }),
      );

      setEmailOpts(userArray);
    } else {
      if (response?.response?.data?.message) {
        return;
      }
      let msg = response?.response?.data?.detail || "Something went wrong";
      dispatch(returnErrors(msg, 400));
    }
  };
  const handleInputChange = (value) => {
    if (typeof value === "string") {
      fetch(value);
    }
  };

  const handleChange = (value) => {
    setCouponData((prev) => ({
      ...prev,
      email: value,
    }));
  };

  const handleSubmit = async () => {
    // console.log(couponData)
    if (couponData.code === "" || couponData.email === "") {
      alert("Please enter a Coupon Code and Email");
      return;
    }
    setIsSpinner(true);
    try {
      dispatch(createAffiliateCode({idToken, couponData}));
      setIsSpinner(false);
    } catch (error) {
      setIsSpinner(false);
      console.error("Failed to create affiliate code:", error);
    }
  };

  return (
    <div className="create_affiliate_code_wrapper">
      <div className="header_wrapper">
        <Breadcrumb separator=">">
          <Breadcrumb.Item>
            <a href="/affiliate-marketing">Affiliate List</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Create Affiliate Code</Breadcrumb.Item>
        </Breadcrumb>
        <Button
          onClick={() => navigate("/affiliate-marketing/affiliateMarketing-logs")}
          className="view_logs__btn standard_button"
        >
          View Logs
        </Button>
      </div>
      <div className="create_plan_form">
        <div className="row1">
          <div className="form_input">
            <label htmlFor="Email">Email</label>
            <Select
              showSearch
              placeholder="Search for a user"
              notFoundContent={isLoading ? <Spin size="small" /> : null}
              filterOption={false}
              onSearch={handleInputChange}
              onChange={handleChange}
              className="react-select-container"
              dropdownClassName="react-select-dropdown"
            >
              {emailOpts.map((option) => (
                <Option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </Option>
              ))}
            </Select>
          </div>
          <div className="form_input">
            <label htmlFor="affiliate_code">Affiliate Code</label>
            <Input
              className="affiliate_input"
              placeholder="Enter Affiliate Code"
              value={couponData.code}
              onChange={(e) => setCouponData((prev) => ({...prev, code: e.target.value}))}
            />
          </div>
        </div>
        <div className="row2">
          <div className="form_input">
            <label htmlFor="commission">Commission (%)</label>
            <Input
              type="number"
              placeholder="0"
              prefix={<PercentageIcon />}
              value={couponData.percentage}
              onChange={(e) =>
                setCouponData((prev) => ({
                  ...prev,
                  percentage: e.target.value,
                }))
              }
            />
          </div>
          <div className="form_input">
            <label htmlFor="repeat_commission">Repeat Commission (%)</label>
            <Input
              type="number"
              placeholder="0"
              prefix={<PercentageIcon />}
              value={couponData.percent_repeat}
              onChange={(e) =>
                setCouponData((prev) => ({
                  ...prev,
                  percent_repeat: e.target.value,
                }))
              }
            />
          </div>
        </div>
        <div className="create_button_wrapper">
          <Button
            className="standard_button"
            onClick={handleSubmit}
            loading={isSpinner}
          >
            {isSpinner ? "Creating..." : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateAffiliateCode;
