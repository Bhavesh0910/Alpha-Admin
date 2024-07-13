import React, {useEffect, useState} from "react";
import "./CreateCoupon.scss";
import crossIcon from "../../../assets/icons/cross_icon_white.svg";
import {Breadcrumb, Button, Checkbox, DatePicker, Input, Select} from "antd";
import {ReactComponent as PercentageIcon} from "../../../assets/icons/precentage_icon_white.svg";
import dayjs from "dayjs";
import {useDispatch, useSelector} from "react-redux";
import {createCoupon} from "../../../store/NewReducers/Coupons";
import {Link} from "react-router-dom";
const {RangePicker} = DatePicker;
const {Option} = Select;
// import coupons

const CreateCoupon = () => {
  const [category, setCategory] = useState("Alpha Pro 5K");
  const [date, setDate] = useState();
  const [size, setSize] = useState("middle");

  const {idToken} = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const options = [];
  for (let i = 10; i < 36; i++) {
    const user = `user${i}@example.com`;
    options.push({
      value: user,
      label: user,
    });
  }

  const handleChange = (value) => {
    console.log(`Selected: ${value}`);
  };

  const handleSizeChange = (e) => {
    setSize(e.target.value);
  };

  useEffect(() => {
    // dispatch(createCoupon(idToken, dispatch))
  }, [idToken]);

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
    // Can not select days before today and today
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

  const onChange = (e) => {
    console.log(`checked = ${e.target.checked}`);
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
        <form
          className="createCouponForm"
          action=""
        >
          <div className="topSection">
            <div className="form_input_box">
              <label htmlFor="coupon_code">Coupon Code</label>
              <Input
                id="coupon_code"
                placeholder="Enter Coupon Code"
              />
            </div>
            <div className="form_input_box">
              <label htmlFor="add_user">Add User</label>
              <Select
                mode="multiple"
                size={size}
                placeholder="Please select users"
                defaultValue={[]}
                onChange={handleChange}
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
              />
            </div>
            <div className="form_input_box">
              <label htmlFor="coupon_percentage">Coupon Percentage</label>
              <Input
                id="coupon_percentage"
                placeholder="Enter Coupon Percentage"
                prefix={<PercentageIcon />}
              />
            </div>
            <div className="form_input_box">
              <label htmlFor="coupon_code">Challenge</label>
              <Select
                className="category_dropdown"
                defaultValue="all"
                onChange={handleCategoryChange}
              >
                <Option value="all">Alpha Pro 5K</Option>
                <Option value="swift">Alpha Pro 10K</Option>
                <Option value="wire">Alpha Pro 20K</Option>
              </Select>
            </div>
            <div className="form_input_box">
              <label htmlFor="coupon_code">Coupon Expiry</label>
              <DatePicker
                format="YYYY-MM-DD HH:mm:ss"
                disabledDate={disabledDate}
                disabledTime={disabledDateTime}
                showTime={{
                  defaultValue: dayjs("00:00:00", "HH:mm:ss"),
                }}
              />
            </div>
          </div>
          <div className="footerSection">
            <div className="status_checkbox_wrapper">
              <Checkbox onChange={onChange}>Is Activate</Checkbox>
              <Checkbox onChange={onChange}>Is public</Checkbox>
            </div>
            <Button className="save_changes_btn">Create</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCoupon;
