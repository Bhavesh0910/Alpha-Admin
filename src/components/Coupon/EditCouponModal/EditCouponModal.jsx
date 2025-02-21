import React, {useEffect, useState} from "react";
import "./EditCouponModal.scss";
import crossIcon from "../../../assets/icons/cross_icon_white.svg";
import {Button, Checkbox, DatePicker, Input, Select, Spin} from "antd";
import {ReactComponent as PercentageIcon} from "../../../assets/icons/precentage_icon_white.svg";
import dayjs from "dayjs";
import {editCoupon} from "../../../store/NewReducers/Coupons";
import {useDispatch} from "react-redux";
import {returnErrors} from "../../../store/reducers/error";
import {getChallenges, UserSearchReq} from "../../../utils/api/apis";
import LoaderOverlay from "../../../ReusableComponents/LoaderOverlay";

const {Option} = Select;

const EditCouponModal = ({editCouponData, idToken, setIsEditModalVisible}) => {
  const [category, setCategory] = useState("Alpha Pro 5K");
  const [editedData, setEditedData] = useState(editCouponData || {});
  // console.log("editCouponData : ", editCouponData);
  // console.log("===================================");
  const [challenges, setChallenges] = useState([]);
  const [emailOpts, setEmailOpts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [couponValue, setCouponValue] = useState(
    editCouponData.coupon_percent !== null && editCouponData.coupon_percent !== undefined && editCouponData.coupon_percent !== 0 ? "Coupon Discount" : "Coupon Amount",
  );

  useEffect(() => {
    fetchChallenges();
    fetchUsers(""); // Initial fetch with an empty string
  }, [idToken]);

  useEffect(() => {
    if (editCouponData) {
      setEditedData(editCouponData);
      if (editCouponData.challenge) {
        // setCategory(editCouponData.challenge); // Pre-select challenge if exists
      }
      if (editCouponData.Coupon_user) {
        // Convert user objects to email values for internal state
        const selectedUserEmails = editCouponData?.Coupon_user?.map((user) => user?.id);
        handleInputChange("Coupon_users", selectedUserEmails);
      }
    }
  }, [editCouponData]);

  const fetchChallenges = async () => {
    setIsLoading(true);
    try {
      const response = await getChallenges(idToken);
      setChallenges(response.data);
    } catch (error) {
      console.error("Error fetching challenges:", error);
    }
    setIsLoading(false);
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
          id: item?.id,
        }));
        setEmailOpts(userArray);
      }
    } catch (error) {
      setIsLoading(false);
      dispatch(returnErrors("Failed to fetch users. Please try again.", 400));
    }
  };

  const handleInputChange = (field, value) => {
    setEditedData((prev) => ({...prev, [field]: value}));
    if (field === "coupon_amount") {
      setEditedData((prev) => ({...prev, [field]: value, coupon_percent: 0}));
    } else if (field === "coupon_percent") {
      setEditedData((prev) => ({...prev, [field]: value, coupon_amount: "0"}));
    } else {
      setEditedData((prev) => ({...prev, [field]: value}));
    }
  };

  useEffect(() => {
    console.log("setEditedData : ", editedData);
  }, [editedData]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = editedData?.id;

    // Map email values to user IDs for payload
    const selectedUserEmails = editedData?.Coupon_users || [];
    const selectedUserIds = emailOpts.filter((option) => selectedUserEmails.includes(option.value)).map((option) => option.id); // Convert emails to IDs

    const updatedFields = {
      coupon_id: id,
      coupon_name: editedData?.coupon_name,
      Coupon_user: editedData?.Coupon_users, // Send IDs in payload
      coupon_amount: parseFloat(editedData?.coupon_amount), // Ensure it's a number
      coupon_percent: parseFloat(editedData?.coupon_percent), // Ensure it's a number
      public: editedData?.public,
      is_active: editedData?.is_active,
      challenge: editedData?.challenge,
      coupon_expiry: editedData?.coupon_expiry,
      multi_use: editedData?.multi_use,
    };

    try {
      dispatch(editCoupon({idToken, id, body: updatedFields, dispatch}));
      handleCloseButton();
      setEditedData({});
    } catch (error) {
      dispatch(returnErrors(error?.response?.data?.detail || "Action Failed! Try Again.", error?.response?.status || 400));
    }
  };

  return (
    <div
      className="editCouponModal_container"
      onClick={handleCloseButton}
    >
      {isLoading && <LoaderOverlay />}
      <div
        className="editCouponModal_wrapper"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="header_wrapper">
          <h3>Edit Coupon</h3>
          <img
            style={{cursor: "pointer"}}
            onClick={handleCloseButton}
            src={crossIcon}
            alt="cross_icon"
          />
        </div>
        <form className="editCouponForm">
          <div className="topSection">
            <div className="form_input_box">
              <label htmlFor="coupon_name">Coupon Code</label>
              <Input
                id="coupon_name"
                value={editedData?.coupon_name || ""}
                placeholder="Enter Coupon Code"
                onChange={(e) => handleInputChange("coupon_name", e.target.value.toUpperCase())}
              />
            </div>
            <div className="form_input_box">
              <label htmlFor="add_user">Add User</label>
              <Select
                mode="multiple"
                placeholder="Please select users"
                defaultValue={editCouponData?.Coupon_user?.map((item) => item?.id)} // Emails used for display
                onChange={(value, x) => {
                  return handleInputChange("Coupon_users", value);
                }} // Handle emails
                options={
                  [
                    ...editCouponData?.Coupon_user?.map((item) => ({
                      label: item?.profile__Email,
                      value: item?.id,
                    })),
                    ...emailOpts,
                  ] || []
                }
                onSearch={fetchUsers} // Fetch users on search input
                showSearch
                filterOption={false}
                // tagRender={({label}) => <div>{label} </div>} // Display email
                notFoundContent={
                  isLoading ? (
                    <Spin
                      size="small"
                      style={{marginLeft: 8}}
                    />
                  ) : null
                }
              />
            </div>
            <div>
              <label htmlFor="coupon_value">Coupon Value</label>
              <div className="coupon_select">
                <div
                  className="form_input_box"
                  style={{maxWidth: "160px"}}
                >
                  <Select
                    className="category_dropdown"
                    defaultValue={couponValue}
                    onChange={setCouponValue}
                  >
                    <Option value="Coupon Amount">Coupon Amount</Option>
                    <Option value="Coupon Discount">Coupon Percent</Option>
                  </Select>
                </div>
                <div
                  className="form_input_box"
                  style={{width: "100%"}}
                >
                  {couponValue === "Coupon Discount" ? (
                    <>
                      <Input
                        type="number"
                        className="coupon_percentage"
                        id="coupon_percentage"
                        placeholder="Enter Coupon Percentage"
                        prefix={<PercentageIcon />}
                        value={editedData?.coupon_percent || ""}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          if (value >= 0 && value < 100) {
                            handleInputChange("coupon_percent", e.target.value);
                          }
                        }}
                        required
                      />
                    </>
                  ) : (
                    <>
                      <Input
                        className="coupon_amount"
                        type="number"
                        id="coupon_amount"
                        placeholder="Enter Coupon Amount"
                        value={editedData?.coupon_amount || ""}
                        onChange={(e) => handleInputChange("coupon_amount", e.target.value)}
                        required
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bottomSection">
            {/* <div className="form_input_box">
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
            </div> */}

            <div className="form_input_box">
              <label htmlFor="coupon_challenge">Challenge</label>
              <Select
                className="category_dropdown"
                value={editedData?.challenge || ""}
                onChange={handleCategoryChange}
              >
                {Object.keys(challenges).map((category) => (
                  <React.Fragment key={category}>
                    {challenges[category].map((challenge) => (
                      <Option
                        key={challenge.id}
                        value={challenge.id}
                      >
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
                showTime={{defaultValue: dayjs("00:00:00", "HH:mm:ss")}}
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
              <Checkbox
                checked={editedData?.multi_use || false}
                onChange={(e) => handleInputChange("multi_use", e.target.checked)}
              >
                Multi Use?
              </Checkbox>
            </div>
            <Button
              className="save_changes_btn"
              type="submit"
              onClick={handleSubmit}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCouponModal;
