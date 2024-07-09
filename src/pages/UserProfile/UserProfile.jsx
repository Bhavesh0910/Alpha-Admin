import React, { useEffect, useState } from "react";
import "./UserProfile.scss";
import { Breadcrumb, Typography, Button, Input, Select, Space, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetailsReq, updateUserDetailsRequest } from "../../utils/api/apis";
import { setUser } from "../../store/reducers/userSlice";
import profileImg from '../../assets/images/profile-edit.svg'
import LoaderOverlay from "../../ReusableComponents/LoaderOverlay";

const { Title } = Typography;
const { Option } = Select;

const UserProfile = () => {
  const [isEditableProfile, setIsEditableProfile] = useState(false);
  const [isEditableAccount, setIsEditableAccount] = useState(false);
  const [category, setCategory] = useState("Alpha Pro 5K");
  const [isLoading, setIsLoading] = useState(false);

  const { idToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.user);

  useEffect(() => {
    if (idToken) {
      setIsLoading(true);
      getUserDetailsReq(idToken)
        .then((response) => {
          dispatch(setUser(response));
          console.log("User details fetched:", response);
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [dispatch, idToken]);

  const [formData, setFormData] = useState({
    first_name: userDetails.first_name || "",
    last_name: userDetails.last_name || "",
    contact: userDetails.contact || "+91 ",
    email: userDetails.email || "",
    selectedCountry: userDetails.country || "",
    city: userDetails.city || "",
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

  const handleSave = () => {
    setIsLoading(true);
    updateUserDetailsRequest({ idToken, formData })
      .then(() => {
        console.log("User details updated:", formData);
      })
      .catch((error) => {
        console.error("Error updating user details:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };



  return (
    <div className="userProfile_container">
      <Breadcrumb
        separator=">"
        items={[
          {
            title: <a href="/user-profile">User Profile</a>,
          },
          {
            title: <a href="">Edit Profile</a>,
          },
        ]}
      />
      <div className="userProfile_wrapper">
       {isLoading && <LoaderOverlay />}
        <form className="userProfileForm user_profile" action="">
          <div className="account_settings_header">
            <div className="profile_details_wrapper">
              <img src={profileImg} alt="" />
              <div>
                <span>{userDetails?.first_name}</span>
                <p>{userDetails?.email}</p>
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
                onChange={(e) =>
                  setFormData({ ...formData, first_name: e.target.value })
                }
              />
            </div>
            <div className="form_input_box">
              <label htmlFor="last_name">Last Name</label>
              <Input
                id="last_name"
                placeholder="Enter Last Name"
                disabled={!isEditableProfile}
                value={formData.last_name}
                onChange={(e) =>
                  setFormData({ ...formData, last_name: e.target.value })
                }
              />
            </div>
            <div className="form_input_box">
              <label htmlFor="contact_number">Contact Number</label>
              <Space.Compact>
                <Input
                  style={{ width: "20%" }}
                  placeholder="Country Code"
                  disabled={!isEditableProfile}
                  value={formData.contact.split(" ")[0]}
                  className="contact_input"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: `${e.target.value} ${formData.contact.split(" ")[1]}`,
                    })
                  }
                />
                <Input
                  style={{ width: "80%" }}
                  placeholder="Phone Number"
                  disabled={!isEditableProfile}
                  value={formData.contact.split(" ")[1]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: `${formData.contact.split(" ")[0]} ${e.target.value}`,
                    })
                  }
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
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="form_input_box">
              <label htmlFor="country">Country</label>
              <Select
                className="country_dropdown"
                defaultValue="Select Country"
                onChange={handleCategoryChange}
                disabled={!isEditableProfile}
                value={formData.selectedCountry}
              >
                <Option value="usa">USA</Option>
                <Option value="canada">Canada</Option>
                <Option value="uk">UK</Option>
                <Option value="australia">Australia</Option>
              </Select>
            </div>
            <div className="form_input_box">
              <label htmlFor="city">City</label>
              <Input
                id="city"
                placeholder="Enter City"
                disabled={!isEditableProfile}
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
              />
            </div>
          </div>
          <div className="reset_password_wrapper">
            <Title className="title" level={3}>
              Reset Password
            </Title>
            <Button
              style={{ maxWidth: "234px" }}
              className="standard_button"
            >
              Send Link For Reset Password
            </Button>
          </div>
        </form>

        <form className="userProfileForm account_settings" action="">
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
              />
            </div>
            <div className="form_input_box">
              <label htmlFor="language">Language</label>
              <Select
                className="language_dropdown"
                defaultValue="Select Language"
                onChange={handleCategoryChange}
                disabled={!isEditableAccount}
              >
                <Option value="english">English</Option>
                <Option value="spanish">Spanish</Option>
                <Option value="french">French</Option>
                <Option value="german">German</Option>
              </Select>
            </div>
            <div className="form_input_box">
              <label htmlFor="timezone">Timezone</label>
              <Select
                className="timezone_dropdown"
                defaultValue="Select Timezone"
                onChange={handleCategoryChange}
                disabled={!isEditableAccount}
              >
                <Option value="gmt">GMT</Option>
                <Option value="est">EST</Option>
                <Option value="pst">PST</Option>
                <Option value="cst">CST</Option>
              </Select>
            </div>
          </div>
          <div className="btn_wrapper">
            <Button onClick={handleSave} style={{ maxWidth: "131px" }} className="standard_button">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
