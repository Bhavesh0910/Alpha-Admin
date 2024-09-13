import React, { useEffect, useState } from "react";
import "./ProfileDetails.scss";
import { Typography, Button, Input, Select, Space } from "antd";
import profileImg from "../../../../assets/images/user.png";
import editBtn from "../../../../assets/icons/editBtnIcon.svg";
import profileIcon from '../../../../assets/icons/profile.svg';
import homeIcon from '../../../../assets/icons/home.svg';
import earthIcon from '../../../../assets/icons/earth.svg';
import cityIcon from '../../../../assets/icons/city.svg';
import zipIcon from '../../../../assets/icons/zip.svg';
import phoneIcon from '../../../../assets/icons/phone.svg';
import emailIcon from '../../../../assets/icons/email.svg';
import { useDispatch, useSelector } from "react-redux";
import { updateUserDetailsRequest } from "../../../../utils/api/apis";
import LoaderOverlay from "../../../../ReusableComponents/LoaderOverlay";
import { getUserProfileData } from "../../../../store/NewReducers/amSlice";
import { returnMessages } from "../../../../store/reducers/message";
import { returnErrors } from "../../../../store/reducers/error";

const { Title } = Typography;
const { Option } = Select;

const ProfileDetails = ({id}) => {
  const [isEditableProfile, setIsEditableProfile] = useState(false);
  const [isEditableAccount, setIsEditableAccount] = useState(false);
  const [category, setCategory] = useState("Alpha Pro 5K");
  const [isLoading, setIsLoading] = useState(false);
  
  const [countryCode, setCountryCode] = useState("+");
  const [phoneNumber, setPhoneNumber] = useState("");

  const { idToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const {userProfileData:data, isLoading: accountsLoading} = useSelector((state) => state.accountMetrics);

  useEffect(() => {
    dispatch(getUserProfileData({ idToken , id }));
  }, [dispatch, idToken]);

  useEffect(() => {
    if (data) {
      setFormData({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        contact: data.contact_number || "+91 ",
        email: data.email || "",
        selectedCountry: data.country || "",
        city: data.city || "",
        username: data.username || "",
        language: data.language || "",
        time_zone: data.time_zone || "", 
      });
      setCountryCode(data?.contact_number?.split(" ")[1] || "+");
      setPhoneNumber(data?.contact_number?.split(" ")[0] || "");
    }
    }, [data]);
  

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
          photo: null
        },
        settings: {
          Language: formData.language,
          Time_Zone: formData.time_zone
        }
      };

      console.log(updatedData)
  
      await updateUserDetailsRequest({ idToken, updatedData, id: id });
  
      dispatch(returnMessages("User details updated successfully" , 200));
      console.log("User details updated:", updatedData);
    } catch (error) {
      console.error("Error updating user details:", error);
      dispatch(returnErrors("Error updating user details" , 400));
    } finally {
      setIsLoading(false);
      setIsEditableProfile(false);
    }
  };

  return (
    <div className="ProfileDetails_container">
      {/* <div className="header_wrapper">
        <h3>User Profile</h3>
      </div> */}
      <div className="ProfileDetails_wrapper">
        {isLoading && <LoaderOverlay />}
        <form className="ProfileDetailsForm user_profile">
          <div className="account_settings_header">
            <div className="profile_details_wrapper">
              <div className="profile_edit_btn">
                <img src={profileImg} alt="ProfileDetailsPic" />
                <button>
                  <img src={editBtn} alt="editButton" />
                </button>
              </div>
              <div>
                <span>{data?.full_name}</span>
                <p>{data?.email}</p>
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
                  style={{width: "30%"}}
                  placeholder="Country Code"
                  disabled={!isEditableProfile}
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                />
                <Input
                  style={{width: "70%"}}
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
                defaultValue="Select Country"
                onChange={(value) => setFormData({ ...formData, selectedCountry: value })}
                disabled={!isEditableProfile}
                value={formData.selectedCountry}
              >
                {/* <Option value="usa">USA</Option>
                <Option value="canada">Canada</Option>
                <Option value="uk">UK</Option>
                <Option value="australia">Australia</Option> */}
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
          <div className="address_wrapper">
            <h2>Address</h2>
            <div className="address_box_wrapper">
                <AddressBox data={data} />
            
            </div>
          </div>
        </form>

        <form className="ProfileDetailsForm account_settings">
          <div className="account_settings_header">
            <Title className="title" level={3}>Account Settings</Title>
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
                defaultValue={formData.language}
                onChange={(value) => setFormData({ ...formData, language: value })}
                disabled={!isEditableAccount}
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
                defaultValue={formData.time_zone}
                onChange={(value) => setFormData({ ...formData, time_zone: value })}
                disabled={!isEditableAccount}
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

const AddressBox = ({ data }) => (
  <div className="address_box">
    <span><img src={profileIcon} alt="" /> <h3>{data && data?.full_name}</h3></span>
    <span><img src={homeIcon} alt="" /> <p>{data && data?.city}</p></span>
    {/* <span><img src={cityIcon} alt="" /> <p>{address.city}</p></span> */}
    <span><img src={earthIcon} alt="" /> <p>{data && data.country}</p></span>
    {/* <span><img src={zipIcon} alt="" /> <p>{address.zip}</p></span> */}
    <span><img src={phoneIcon} alt="" /> <p>{data && data.contact_number}</p></span>
    <span><img src={emailIcon} alt="" /> <p>{data && data.email}</p></span>
  </div>
);

export default ProfileDetails;
