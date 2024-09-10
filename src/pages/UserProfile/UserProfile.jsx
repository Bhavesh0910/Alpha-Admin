import React, { useEffect, useState } from "react";
import "./UserProfile.scss";
import { Breadcrumb, Typography, Button, Input, Select, Space, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { updateUserDetailsRequest } from "../../utils/api/apis";
import { setUser } from "../../store/reducers/userSlice";
import profileImg from "../../assets/images/user.png";
import editBtn from "../../assets/icons/editBtnIcon.svg";
import LoaderOverlay from "../../ReusableComponents/LoaderOverlay";
import { getUserProfileData, requestPasswordReset } from "../../store/NewReducers/userProfileSlice";
import { returnMessages } from "../../store/reducers/message";
import { returnErrors } from "../../store/reducers/error";

const { Title } = Typography;
const { Option } = Select;

const UserProfile = () => {
  const [isEditableProfile, setIsEditableProfile] = useState(false);
  const [isEditableAccount, setIsEditableAccount] = useState(false);
  const [category, setCategory] = useState("Alpha Pro 5K");
  const [isLoading, setIsLoading] = useState(false);

  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    contact: "+91 ",
    email: "",
    selectedCountry: "",
    city: "",
    username: "",
    language: "",
    time_zone: "",
  });

  const { idToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const { data, isLoading: accountsLoading } = useSelector((state) => state.userProfile);

  useEffect(() => {
    dispatch(getUserProfileData({ idToken, dispatch }));
  }, [dispatch, idToken]);

  useEffect(() => {
    if (data?.data) {
      setFormData({
        first_name: data.data.first_name || "",
        last_name: data.data.last_name || "",
        email: data.data.email || "",
        selectedCountry: data.data.Country || "",
        city: data.data.City || "",
        username: data.data.username || "",
        language: data.data.language || "",
        time_zone: data.data.time_zone || "",
      });

      setCountryCode(data.data.Contact_number?.split(" ")[1] || "+91");
      setPhoneNumber(data.data.Contact_number?.split(" ")[0] || "");
    }
  }, [data]);

  const handleCategoryChange = (value) => {
    setCategory(value);
  };

  const toggleEditableProfile = () => {
    setIsEditableProfile(!isEditableProfile);
  };

  const toggleEditableAccount = () => {
    setIsEditableAccount(!isEditableAccount);
  };

  const handleSave = async () => {
    const userId = data?.data?.User_id?.id;

    setIsLoading(true);

    try {
      const updatedData = {
        profile: {
          full_name: `${formData.first_name} ${formData.last_name}`,
          first_name: formData.first_name,
          last_name: formData.last_name,
          Contact_number: `${countryCode} ${phoneNumber}`,
          Country: formData.selectedCountry,
          City: formData.city,
          photo: null,
        },
        settings: {
          Language: formData.language || null,
          Time_Zone: formData.time_zone || null,
        },
      };

      console.log(updatedData , formData)
      await updateUserDetailsRequest({ idToken, updatedData, id: userId });

      dispatch(returnMessages("User details updated successfully"));
    } catch (error) {
      console.error("Error updating user details:", error);
      dispatch(returnErrors("Error updating user details"));
    } finally {
      setIsLoading(false);
      setIsEditableProfile(false);
      setIsEditableAccount(false); // Ensure this is also saved
    }
  };

  const handlePasswordReset = () => {
    if (data?.data?.email) {
      dispatch(requestPasswordReset({ idToken, email: data.data.email }));
    } else {
      console.error("Email is not available for password reset.");
    }
  };

  return (
    <div className="userProfile_container">
      <div className="header_wrapper">
        <h3>User Profile</h3>
      </div>
      <div className="userProfile_wrapper">
        {isLoading && <LoaderOverlay />}
        <form className="userProfileForm user_profile">
          <div className="account_settings_header">
            <div className="profile_details_wrapper">
              <div className="profile_edit_btn">
                <img src={profileImg} alt="userProfilePic" />
                <button>
                  <img src={editBtn} alt="editButton" />
                </button>
              </div>
              <div>
                <span>{data?.data?.first_name}</span>
                <p>{data?.data?.email}</p>
              </div>
            </div>
            <Button className="edit_btn" onClick={toggleEditableProfile}>
              {isEditableProfile ? "Save" : "Edit"}
            </Button>
          </div>
          <div className="topSection">
            <div className="form_input_box">
              <label htmlFor="first_name">First Name</label>
              <Input
                id="first_name"
                placeholder="Enter First Name"
                disabled={!isEditableProfile}
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              />
            </div>
            <div className="form_input_box">
              <label htmlFor="last_name">Last Name</label>
              <Input
                id="last_name"
                placeholder="Enter Last Name"
                disabled={!isEditableProfile}
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              />
            </div>
            <div className="form_input_box">
              <label htmlFor="contact_number">Contact Number</label>
              <Space.Compact>
                <Input
                  style={{ width: "30%" }}
                  placeholder="Country Code"
                  disabled={!isEditableProfile}
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                />
                <Input
                  style={{ width: "70%" }}
                  placeholder="Phone Number"
                  disabled={!isEditableProfile}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </Space.Compact>
            </div>
            <div className="form_input_box">
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                placeholder="Enter Email"
                disabled={!isEditableProfile}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="form_input_box">
              <label htmlFor="country">Country</label>
              <Select
                className="country_dropdown"
                placeholder="Select Country"
                onChange={(value) => setFormData({ ...formData, selectedCountry: value })}
                disabled={!isEditableProfile}
                value={formData.selectedCountry}
              >
                {/* Add your country options here */}
              </Select>
            </div>
            <div className="form_input_box">
              <label htmlFor="city">City</label>
              <Input
                id="city"
                placeholder="Enter City"
                disabled={!isEditableProfile}
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
          </div>
          <div className="reset_password_wrapper">
            <Title className="title" level={3}>
              Reset Password
            </Title>
            <Button
              onClick={handlePasswordReset}
              style={{ maxWidth: "234px" }}
              className="standard_button"
            >
              Send Link For Reset Password
            </Button>
          </div>
        </form>

        <form className="userProfileForm account_settings">
          <div className="account_settings_header">
            <Title className="title" level={3}>
              Account Settings
            </Title>

            <Button className="edit_btn" onClick={toggleEditableAccount}>
              {isEditableAccount ? "Save" : "Edit"}
            </Button>
          </div>
          <div className="topSection">
            <div className="form_input_box">
              <label htmlFor="username">Username</label>
              <Input
                id="username"
                placeholder="Enter Username"
                disabled={!isEditableAccount}
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
            <div className="form_input_box">
              <label htmlFor="language">Language</label>
              <Select
                className="language_dropdown"
                placeholder="Select Language"
                onChange={(value) => setFormData({ ...formData, language: value })}
                disabled={!isEditableAccount}
                value={formData.language}
              >
                {/* <Option value="english">English</Option>
                <Option value="spanish">Spanish</Option>
                <Option value="french">French</Option>
                <Option value="german">German</Option> */}
              </Select>
            </div>
            <div className="form_input_box">
              <label htmlFor="timezone">Timezone</label>
              <Select
                className="timezone_dropdown"
                placeholder="Select Timezone"
                onChange={(value) => setFormData({ ...formData, time_zone: value })}
                disabled={!isEditableAccount}
                value={formData.time_zone}
              >
                {/* <Option value="gmt">GMT</Option>
                <Option value="est">EST</Option>
                <Option value="pst">PST</Option>
                <Option value="cst">CST</Option> */}
              </Select>
            </div>
          </div>
          <div className="btn_wrapper">
            <Button
              onClick={handleSave}
              style={{ maxWidth: "131px" }}
              className="standard_button"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
