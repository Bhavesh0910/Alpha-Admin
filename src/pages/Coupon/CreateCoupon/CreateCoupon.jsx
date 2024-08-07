import React, { useEffect, useState, useRef } from "react";
import "./CreateCoupon.scss";
import { Breadcrumb, Button, Checkbox, DatePicker, Input, Select } from "antd";
import { ReactComponent as PercentageIcon } from "../../../assets/icons/precentage_icon_white.svg";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { createCoupon } from "../../../store/NewReducers/Coupons";
import { Link } from "react-router-dom";
import { returnErrors } from "../../../store/reducers/error";
import { UserSearchReq, getChallenges } from "../../../utils/api/apis";

const { Option } = Select;

const CreateCoupon = () => {
  const [category, setCategory] = useState();
  const [date, setDate] = useState();
  const [size, setSize] = useState("middle");
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [code, setCode] = useState("");
  const [users, setUsers] = useState([]);
  const [emails, setEmails] = useState([]);
  const [couponAmount, setCouponAmount] = useState("");
  const [percent, setPercent] = useState();
  const [isActivate, setIsActivate] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [challenges, setChallenges] = useState({});
  const timeoutRef = useRef(null);

  const { idToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch challenges on component mount
    const fetchChallenges = async () => {
      try {
        const res = await getChallenges(idToken);
        setChallenges(res?.data || {});
      } catch (error) {
        console.log("Error fetching challenges:", error);
        dispatch(returnErrors("Failed to fetch challenges", 500));
      }
    };

    fetchChallenges();
  }, [idToken, dispatch]);

  useEffect(() => {
    console.log("Date : ", date);
    console.log("options : ", options);
    console.log("users : ", users);
    console.log("emails : ", emails);
    console.log("challenges : ", challenges);
  }, [date, options, users, challenges]);

  const fetch = async (value) => {
    setIsLoading(true);
    try {
      const response = await UserSearchReq(idToken, value);
      setIsLoading(false);
      if (response?.status < 399) {
        let userArray = response?.data?.results.map((item) => ({
          label: item?.email,
          value: item?.id,
        }));
        setOptions(userArray);
      } else {
        const msg = response.response.data.message || "Failed to fetch users";
        dispatch(returnErrors(msg, 400));
      }
    } catch (error) {
      setIsLoading(false);
      dispatch(returnErrors("Failed to fetch users", 500));
    }
  };

  const handleOnInputChange = (value) => {
    if (typeof value === "string" && value.length > 0) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        fetch(value);
      }, 1500);
    }
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
  };

  const range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  };

  const disabledDate = (current) => {
    return current && current < dayjs().endOf("day");
  };

  const disabledDateTime = () => ({
    disabledHours: () => range(0, 24).splice(4, 20),
    disabledMinutes: () => range(30, 60),
    disabledSeconds: () => [55, 56],
  });

  const disabledRangeTime = (_, type) => {
    if (type === "start") {
      return {
        disabledHours: () => range(0, 60).splice(4, 20),
        disabledMinutes: () => range(30, 60),
        disabledSeconds: () => [55, 56],
      };
    }
    return {
      disabledHours: () => range(0, 60).splice(20, 4),
      disabledMinutes: () => range(0, 31),
      disabledSeconds: () => [55, 56],
    };
  };

  const handleChange = (values) => {
    console.log(values, "valuess");
    const selectedLabels = options
      .filter((option) => values.includes(option.value))
      .map((option) => option.label);
    setEmails(selectedLabels);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const couponData = {
      coupon_name: code,
      Coupon_user: users,
      coupon_amount: couponAmount,
      coupon_percent: percent,
      challenge: category,  // Directly use the challenge ID
      coupon_expiry: date,
      public: isPublic,
      is_active: isActivate
    };
    console.log("Here...");
    console.log(idToken, couponData, dispatch);
    dispatch(createCoupon({ idToken, couponData, dispatch }));
  };

  const Loading = () => {
    return <div>Loading...</div>;
  };

  return (
    <div className="createCouponModal_container">
      <Breadcrumb
        separator=">"
        items={[
          {
            title: <Link to="/coupon">Coupons</Link>,
          },
          {
            title: <Link to="">Create Coupon</Link>,
          },
        ]}
      />
      <div className="createCouponModal_wrapper">
        <form className="createCouponForm" onSubmit={handleFormSubmit}>
          <div className="topSection">
            <div className="form_input_box">
              <label htmlFor="coupon_code">Coupon Code</label>
              <Input
                id="coupon_code"
                placeholder="Enter Coupon Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <div className="form_input_box">
              <label htmlFor="add_user">Add User</label>
              <Select
                mode="multiple"
                size={size}
                placeholder="Please select users"
                value={users}
                onSearch={handleOnInputChange}
                onChange={(value) => {
                  setUsers(value);
                  handleChange(value);
                }}
                notFoundContent={isLoading ? <Loading /> : null}
                options={options}
              />
            </div>
          </div>
          <div className="bottomSection">
            <div className="form_input_box">
              <label htmlFor="coupon_amount">Coupon Amount</label>
              <Input
                id="coupon_amount"
                placeholder="Enter Coupon Amount"
                value={couponAmount}
                onChange={(e) => setCouponAmount(e.target.value)}
              />
            </div>
            <div className="form_input_box">
              <label htmlFor="coupon_percentage">Coupon Percentage</label>
              <Input
                id="coupon_percentage"
                placeholder="Enter Coupon Percentage"
                prefix={<PercentageIcon />}
                value={percent}
                onChange={(e) => setPercent(Number(e.target.value))}
              />
            </div>
            <div className="form_input_box">
              <label htmlFor="challenge_id">Challenge</label>
              <Select
                id="challenge_id"
                placeholder="Select Challenge"
                value={category}
                onChange={handleCategoryChange}
              >
                {Object.keys(challenges).map((category) => (
                  <React.Fragment key={category}>
                    {challenges[category].map((challenge) => (
                      <Option key={challenge.id} value={challenge.id}>
                        {challenge.name}
                      </Option>
                    ))}
                  </React.Fragment>
                ))}
              </Select>
            </div>
            <div className="form_input_box">
              <label htmlFor="coupon_expiry">Coupon Expiry</label>
              <DatePicker
                format="YYYY-MM-DD HH:mm:ss"
                disabledDate={disabledDate}
                disabledTime={disabledDateTime}
                showTime={{ defaultValue: dayjs("00:00:00", "HH:mm:ss") }}
                onChange={(value) => setDate(value ? value.format("YYYY-MM-DD") : null)}
              />
            </div>
          </div>
          <div className="footerSection">
            <div className="status_checkbox_wrapper">
              <Checkbox checked={isActivate} onChange={(e) => setIsActivate(e.target.checked)}>
                Is Activate
              </Checkbox>
              <Checkbox checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)}>
                Is Public
              </Checkbox>
            </div>
            <Button type="primary" htmlType="submit" className="save_changes_btn">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCoupon;
