import React, { useEffect, useState } from "react";
import "./EditCouponModal.scss";
import crossIcon from "../../../assets/icons/cross_icon_white.svg";
import { Button, Checkbox, DatePicker, Input, Select, Spin } from "antd";
import { ReactComponent as PercentageIcon } from "../../../assets/icons/precentage_icon_white.svg";
import dayjs from "dayjs";
import moment from "moment";
import { editCoupon } from "../../../store/NewReducers/Coupons";
import { useDispatch } from "react-redux";
import { returnErrors } from "../../../store/reducers/error";
import { returnMessages } from "../../../store/reducers/message";
import { getChallenges, UserSearchReq } from "../../../utils/api/apis";

const { Option } = Select;

const EditCouponModal = ({ editCouponData, idToken, setIsEditModalVisible }) => {
  const [category, setCategory] = useState("Alpha Pro 5K");
  const [editedData, setEditedData] = useState(editCouponData || {});
  const [challenges, setChallenges] = useState([]);
  const [emailOpts, setEmailOpts] = useState([]); // State to hold user options
  const [isLoading, setIsLoading] = useState(false); // State for loading spinner
  const dispatch = useDispatch();

  useEffect(() => {
    fetchChallenges();
    fetchUsers(""); // Initial fetch with an empty string
  }, []);

  const fetchChallenges = async () => {
    try {
      const response = await getChallenges(idToken);
      setChallenges(response.data);
    } catch (error) {
      console.error("Error fetching challenges:", error);
    }
  };

  const fetchUsers = async (value) => {
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
      } 
    } catch (error) {
      setIsLoading(false);
      dispatch(returnErrors("Failed to fetch users. Please try again.", 400));
    }
  };

  const handleInputChange = (field, value) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCloseButton = () => {
    setIsEditModalVisible(false);
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
    handleInputChange("challenge", value);
  };

  const handleDateChange = (date) => {
    handleInputChange("coupon_expiry", date ? date.format("YYYY-MM-DD") : "");
  };
  console.log(editCouponData)

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = editCouponData?.id;

    const updatedFields = {
      coupon_id: id,
      coupon_name: editedData?.coupon_name,
      Coupon_user: editedData?.Coupon_users || [], 
      coupon_amount: parseFloat(editedData?.coupon_amount), // Ensure it's a number
      coupon_percent: parseFloat(editedData?.coupon_percent), // Ensure it's a number
      public: editedData?.public,
      is_active: editedData?.is_active,
      challenge: editedData?.challenge,
      coupon_expiry: editedData?.coupon_expiry,
    };
    

    try {
      dispatch(editCoupon({ idToken, id, body: updatedFields , dispatch}));
      handleCloseButton();
    } catch (error) {
      console.log(error)
      dispatch(returnErrors(error?.response?.data?.detail || "Action Failed! Try Again.", error?.response?.status || 400));
    }
  };

  return (
    <div className="editCouponModal_container" onClick={handleCloseButton}>
      <div className="editCouponModal_wrapper" onClick={(e) => e.stopPropagation()}>
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
              <label htmlFor="coupon_name">Coupon Code</label>
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
                options={emailOpts}
                onSearch={fetchUsers} // Fetch users on search input
                showSearch
                filterOption={false}
              >
                {isLoading && <Spin size="small" style={{ marginLeft: 8 }} />}
              </Select>
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
                format="YYYY-MM-DD"
                disabledDate={(current) => current && current < dayjs().endOf("day")}
                placeholder="Select Expiry Date"
                showTime={{
                  defaultValue: dayjs("00:00:00", "HH:mm:ss"),
                }}
                value={editedData?.coupon_expiry ? dayjs(editedData.coupon_expiry) : null}
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
