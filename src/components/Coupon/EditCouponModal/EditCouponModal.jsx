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

  const [editedData, setEditedData] = useState(editCouponData || {});

  const handleInputChange = (field, value) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };

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
    handleInputChange("challenge", value);
  };

  const handleDateChange = (date) => {
    handleInputChange("coupon_expiry", date ? date.format("YYYY-MM-DD HH:mm:ss") : "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = editCouponData?.id;
    try {
      dispatch(editCoupon({ idToken, id, body: editedData }));
      console.log("idToken, id, editedData ", idToken, id, editedData);
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
                id="coupon_name"
                value={editedData?.coupon_name || ""}
                placeholder="Enter Coupon Code"
                onChange={(e) => handleInputChange("coupon_name", e.target.value)}
              />
            </div>
            <div className="form_input_box">
              <label htmlFor="add_user">Add User</label>
              <Select
                mode="multiple"
                placeholder="Please select users"
                defaultValue={editedData?.Coupon_users || []}
                onChange={(value) => handleInputChange("Coupon_users", value)}
                options={options}
              />
            </div>
          </div>
          <div className="bottomSection">
            <div className="form_input_box">
              <label htmlFor="coupon_amount">Amount</label>
              <Input
                id="coupon_amount"
                value={editedData?.coupon_amount || ""}
                placeholder="Enter Coupon Amount"
                onChange={(e) => handleInputChange("coupon_amount", e.target.value)}
              />
            </div>
            <div className="form_input_box">
              <label htmlFor="coupon_percentage">Coupon Percentage</label>
              <Input
                id="coupon_percent"
                placeholder="Enter Coupon Percentage"
                prefix={<PercentageIcon />}
                value={editedData?.coupon_percent || ""}
                onChange={(e) => handleInputChange("coupon_percent", e.target.value)}
              />
            </div>
            <div className="form_input_box">
              <label htmlFor="coupon_challenge">Challenge</label>
              <Select
                className="category_dropdown"
                defaultValue={category}
                onChange={handleCategoryChange}
                value={editedData?.challenge || ""}
              >
                {/* Add your options here */}
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
                value={editedData?.coupon_expiry ? moment(editedData.coupon_expiry) : null}
                onChange={handleDateChange}
              />
            </div>
          </div>
          <div className="footerSection">
            <div className="status_checkbox_wrapper">
              <Checkbox
                checked={editedData?.is_active || false}
                onChange={(e) => handleInputChange("is_active", e.target.checked)}
              >
                Is Active
              </Checkbox>
              <Checkbox
                checked={editedData?.public || false}
                onChange={(e) => handleInputChange("public", e.target.checked)}
              >
                Is Public
              </Checkbox>
            </div>
            <Button className="save_changes_btn" onClick={handleSubmit} type="submit">Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCouponModal;
