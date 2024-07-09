import React, { useEffect, useState } from "react";
import "./EditCouponModal.scss";
import crossIcon from "../../../assets/icons/cross_icon_white.svg";
import { Button, Checkbox, DatePicker, Input, Select } from "antd";
import { ReactComponent as PercentageIcon } from "../../../assets/icons/precentage_icon_white.svg";
import dayjs from "dayjs";
import moment from "moment";
import { editCoupon, patchCoupon, setCouponRefresh } from "../../../store/NewReducers/Coupons";
import { useDispatch } from "react-redux";
import { returnErrors } from "../../../store/reducers/error";
import { returnMessages } from "../../../store/reducers/message";
const { Option } = Select;

const EditCouponModal = ({ editCouponData, idToken, setIsEditModalVisible }) => {

  const [category, setCategory] = useState("Alpha Pro 5K");
  const dispatch = useDispatch();

  const [editedData, setEditedData] = useState({});

  const handleInputChange = (field, value) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };
  useEffect(() => {
    // console.log("Edited data : ", editedData);
  }, [editedData])
  const handleCloseButton = () => {
    setIsEditModalVisible(false);
  };

  const options = [];
  for (let i = 10; i < 36; i++) {
    const user = `user${i}@example.com`;
    options.push({
      value: user,
      label: user,
    });
  }

  const handleCategoryChange = (value) => {
    setCategory(value);
  };

  const handleDateChange = (date) => {
    handleInputChange("expiry", date ? date.format("YYYY-MM-DD HH:mm:ss") : "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = editCouponData?.id;
    try {
      dispatch(editCoupon({ idToken, id, body:editedData }))
      console.log("idToken, id, editedData ",idToken, id, editedData )
      // await patchCoupon(idToken, editCouponData?.id, editedData);
      dispatch(returnMessages("Action Successful!", 200));
      handleCloseButton();
      // dispatch(setCouponRefresh());
    } catch (error) {
      dispatch(returnErrors(error?.response?.data?.detail || "Action Failed! Try Again.", error?.response?.status || 400));
    }
  };

  return (
    <div className="editCouponModal_container" onClick={handleCloseButton}>
      <div
        className="editCouponModal_wrapper"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="header_wrapper">
          <h3>Edit Coupon</h3>
          <img
            style={{ cursor: "pointer" }}
            onClick={handleCloseButton}
            src={crossIcon}
            alt="cross_icon"
          />
        </div>
        <form className="editCouponForm" onSubmit={handleSubmit}>
          <div className="topSection">
            <div className="form_input_box">
              <label htmlFor="coupon_code">Coupon Code</label>
              <Input
                id="coupon_code"
                value={editedData?.code || editCouponData?.code || ""}
                placeholder="Enter Coupon Code"
                onChange={(e) => handleInputChange("code", e.target.value)}
              />
            </div>
            <div className="form_input_box">
              <label htmlFor="add_user">Add User</label>
              <Select
                mode="multiple"
                placeholder="Please select users"
                // defaultValue={editedData.users || []}
                defaultValue={[]}
                onChange={(value) => handleInputChange("users", value)}
                options={options}
              />
            </div>
          </div>
          <div className="bottomSection">
            <div className="form_input_box">
              <label htmlFor="coupon_amount">Amount</label>
              <Input
                id="coupon_amount"
                value={editedData?.amount || editCouponData?.amount || 0}
                placeholder="Enter Coupon Amount"
                onChange={(e) => handleInputChange("amount", e.target.value)}
              />
            </div>
            <div className="form_input_box">
              <label htmlFor="coupon_percentage">Coupon Percentage</label>
              <Input
                id="coupon_percentage"
                placeholder="Enter Coupon Percentage"
                prefix={<PercentageIcon />}
                value={editedData?.percent || editCouponData?.percent || "0"}
                onChange={(e) => handleInputChange("percent", e.target.value)}
              />
            </div>
            <div className="form_input_box">
              <label htmlFor="coupon_challenge">Challenge</label>
              <Select
                className="category_dropdown"
                defaultValue={category}
                onChange={handleCategoryChange}
                value={editedData?.challenge || editCouponData?.challenge || ""}
              >
                {/* <Option value="Alpha Pro 5K">Alpha Pro 5K</Option>
                <Option value="Alpha Pro 10K">Alpha Pro 10K</Option>
                <Option value="Alpha Pro 20K">Alpha Pro 20K</Option> */}
              </Select>
            </div>
            <div className="form_input_box">
              <label htmlFor="coupon_expiry">Coupon Expiry</label>
              <DatePicker
                format="YYYY-MM-DD HH:mm:ss"
                disabledDate={(current) => current && current < dayjs().endOf("day")}
                placeholder="Select Expiry Date"
                showTime={{
                  defaultValue: dayjs("00:00:00", "HH:mm:ss"),
                }}
                value={editedData.expiry ? moment(editedData.expiry) : null}
                onChange={handleDateChange}
              />
            </div>
          </div>
          <div className="footerSection">
            <div className="status_checkbox_wrapper">
              <Checkbox
                checked={editedData?.is_active || editCouponData?.is_active || false}
                onChange={(e) => handleInputChange("is_active", e.target.checked)}
              >
                Is Active
              </Checkbox>
              <Checkbox
                checked={editedData?.public || editCouponData?.public || false}
                onChange={(e) => handleInputChange("public", e.target.checked)}
              >
                Is Public
              </Checkbox>
            </div>
            <Button className="save_changes_btn" onClick={(e) => handleSubmit(e)} type="submit">Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCouponModal;
