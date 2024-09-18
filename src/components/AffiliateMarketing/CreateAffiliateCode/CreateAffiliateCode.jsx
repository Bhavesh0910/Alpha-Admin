import React, {useState} from "react";
import {Breadcrumb, Button, Input, notification, Select, Spin} from "antd";
import {ReactComponent as PercentageIcon} from "../../../assets/icons/precentage_icon_white.svg";
import "./CreateAffiliateCode.scss";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {createAffiliateCode, fetchCodeList} from "../../../store/NewReducers/affiliateSlice";
import {UserSearchReq, baseUrl} from "../../../utils/api/apis";
import {returnErrors} from "../../../store/reducers/error";
import LoaderOverlay from "../../../ReusableComponents/LoaderOverlay";

const {Option} = Select;

const CreateAffiliateCode = () => {
  const [isSpinner, setIsSpinner] = useState(false);
  const [couponData, setCouponData] = useState({
    email: "",
    code: "",
    aff_percentage: 0,
    repeat_percent: 0,
    coupon_percent: 0,
  });

  const [emailOpts, setEmailOpts] = useState([{label: "", value: ""}]);
  const [isLoading, setIsLoading] = useState(false);
  const idToken = useSelector((state) => state.auth.idToken);
  const createdLink = useSelector((state) => state.affiliate.createdLink);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetch = async (value) => {
    setIsLoading(true);
    try {
      const response = await UserSearchReq(idToken, value);
      setIsLoading(false);
      if (response?.status < 399) {
        const userArray = response?.data?.results?.map((item) => ({
          label: item?.email,
          value: item?.id,
        }));
        setEmailOpts(userArray);
      } else {
        if (response?.response?.data?.message) {
          return;
        }
        let msg = response?.response?.data?.detail || "Something went wrong";
        dispatch(returnErrors(msg, 400));
      }
    } catch (error) {
      setIsLoading(false);
      dispatch(returnErrors("Failed to fetch users. Please try again.", 400));
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
    if (couponData.code === "" || couponData.email === "") {
      notification.warning({message:"Please enter Coupon Code and Email"});
      return;
    }

    setIsSpinner(true);


    const formData = new FormData();
    formData.append("email", couponData.email);
    formData.append("code", couponData.code);
    formData.append("aff_percentage", couponData.aff_percentage);
    formData.append("repeat_percent", couponData.repeat_percent);
    formData.append("coupon_percent", couponData.coupon_percent);

    try {
      await dispatch(createAffiliateCode({idToken, couponData: formData}));
      setIsSpinner(false);
    } catch (error) {
      setIsSpinner(false);
      console.error("Failed to create affiliate code:", error);
    }
  };

  return (
    <div className="create_affiliate_code_wrapper">
      {isSpinner && <LoaderOverlay />}
      <div className="header_wrapper">
        <Breadcrumb separator=">">
          <Breadcrumb.Item>
            <Link to="/affiliate-marketing">Affiliate List</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Create Affiliate Code</Breadcrumb.Item>
        </Breadcrumb>
        <Button
          onClick={() => navigate("affiliate-marketing/logs")}
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
                  value={option.label}
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
              value={couponData.aff_percentage}
              onChange={(e) =>
                setCouponData((prev) => ({
                  ...prev,
                  aff_percentage: e.target.value,
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
              value={couponData.repeat_percent}
              onChange={(e) =>
                setCouponData((prev) => ({
                  ...prev,
                  repeat_percent: e.target.value,
                }))
              }
            />
          </div>
        </div>
        <div className="form_input">
          <label htmlFor="coupon_percent">Discount (%)</label>
          <Input
            type="number"
            value={couponData.coupon_percent}
            onChange={(e) => setCouponData((prev) => ({...prev, coupon_percent: e.target.value}))}
          />
        </div>
        <div className="create_button_wrapper">
          <Button
            className="standard_button"
            onClick={handleSubmit}
          >
            {isSpinner ? "Creating..." : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateAffiliateCode;
