import {EyeInvisibleOutlined, EyeTwoTone} from "@ant-design/icons";
import {Button, Input, Modal, Select, Spin} from "antd";
import TextArea from "antd/es/input/TextArea";
import "./UserSupport.scss";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {updateUserEmailThunk, requestPayoutThunk} from "../../store/NewReducers/usSlice";
import {returnErrors} from "../../store/reducers/error";
import {UserSearchReq} from "../../utils/api/apis";

const {Option} = Select;

const UserSupport = () => {
  const [activeTab, setActiveTab] = useState("change_email");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const idToken = useSelector((state) => state.auth.idToken);
  const [emailOpts, setEmailOpts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const {fundingData} = useSelector((state) => state.funding);

  const [isModalVisible, setIsModalVisible] = useState(false);

  // Form state variables
  const [currentEmail, setCurrentEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [loginId, setLoginId] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  // User search by email
  const fetch = async (value) => {
    setIsLoading(true);
    const response = await UserSearchReq(idToken, value);
    setIsLoading(false);
    if (response?.status < 399) {
      const userArray = response?.data?.results?.map((item) => ({
        label: item?.email,
        value: item?.id,
      }));
      setEmailOpts(userArray);
      // console.log(userArray, "userarray");
    } else {
      const msg = response?.response?.data?.detail || "Something went wrong";
      dispatch(returnErrors(msg, 400));
    }
  };

  useEffect(() => {
    fetch("");
  }, []);

  let timeoutId;
  const handleOnInputChange = (value) => {
    const filteredOptions = emailOpts.filter((option) => option.label.toLowerCase().includes(value.toLowerCase()));

    setEmailOpts(filteredOptions);
    if (typeof value === "string" && value?.length > 0) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        fetch(value);
      }, 1500);
    }
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleSubmit = () => {
    if (activeTab === "change_email") {
        const formData = new FormData();
        formData.append("cur_email", currentEmail);
        // formData.append("pwd", currentPassword);
        formData.append("new_email", newEmail);

        dispatch(updateUserEmailThunk({ idToken, payload: formData }))
            .unwrap() 
            .then(() => {
                // setCurrentEmail('');
                // setCurrentPassword('');
                setNewEmail('');
            })
            .catch((error) => {
                console.error("Failed to update email:", error);
            });

    } else if (activeTab === "request_payout") {
        const formData = new FormData();
        formData.append("login_id", loginId);
        formData.append("amount", amount);
        formData.append("reason", reason);

        dispatch(requestPayoutThunk({ idToken, payload: formData }))
            .unwrap() 
            .then(() => {
                // Resetting form fields
                setLoginId('');
                setAmount('');
                setReason('');
            })
            .catch((error) => {
                // Handle error if needed
                console.error("Failed to request payout:", error);
            });
    }

    setIsModalVisible(false);
};

  return (
    <div className="userSupport_container">
      <div className="header_wrapper">
        <div className="filter_buttons">
          <Button
            className={activeTab === "change_email" ? "active" : ""}
            onClick={() => handleTabChange("change_email")}
          >
            Change Email
          </Button>
          <Button
            className={activeTab === "request_payout" ? "active" : ""}
            onClick={() => handleTabChange("request_payout")}
          >
            Request Payout
          </Button>
        </div>
        <Button
          onClick={() => navigate(activeTab === "change_email" ? "changeEmail-logs" : "request-payout")}
          className="view_logs__btn standard_button"
        >
          View Logs
        </Button>
      </div>
      <div className="userSupportForm_wrapper">
        {activeTab === "change_email" ? (
          <ChangeEmail
            handleOnInputChange={handleOnInputChange}
            emailOpts={emailOpts}
            isLoading={isLoading}
            currentEmail={currentEmail}
            setCurrentEmail={setCurrentEmail}
            currentPassword={currentPassword}
            setCurrentPassword={setCurrentPassword}
            newEmail={newEmail}
            setNewEmail={setNewEmail}
          />
        ) : (
          <ReqPayoutForm
            loginId={loginId}
            setLoginId={setLoginId}
            amount={amount}
            setAmount={setAmount}
            reason={reason}
            setReason={setReason}
          />
        )}
        <div className="footer_section">
          <Button
            className="standard_button"
            onClick={() => setIsModalVisible(true)}
          >
            Submit
          </Button>
        </div>
        <Modal
          title={`Are you sure that you want too perform this action`}
          open={isModalVisible}
          style={{color: "white"}}
          onCancel={() => setIsModalVisible(false)}
          centered
          className="table-modal"
          footer={[
            <div className="modal-btns-wrapper">
              <Button
                className="cancel-btn"
                key="cancel"
                onClick={() => setIsModalVisible(false)}
              >
                Cancel
              </Button>
              <Button
                className="standard_button block_btn"
                key="block"
                type="primary"
                danger
                onClick={() => handleSubmit()}
              >
                Yes
              </Button>
            </div>,
          ]}
        ></Modal>
      </div>
    </div>
  );
};

const ChangeEmail = ({handleOnInputChange, emailOpts, isLoading, currentEmail, setCurrentEmail, currentPassword, setCurrentPassword, newEmail, setNewEmail}) => {
  const [selectEmail, setSelectEmail] = useState(null);

  const handleEmailChange = (value) => {
    setSelectEmail(value);
    setCurrentEmail(value); // Update current email when selecting an option
  };

  return (
    <form className="userSupportForm_changeEmail">
      <div className="change_form_inputFields">
        <div className="form_input_box">
          <label htmlFor="current_email">Current Email</label>
          <Select
            showSearch
            placeholder="Search for a user"
            style={{width: "100%"}}
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false} // Let's use custom filtering logic
            onSearch={handleOnInputChange} // Trigger search on input change
            onChange={handleEmailChange} // Handle email selection change
            notFoundContent={isLoading ? <Spin size="small" /> : null}
            value={selectEmail} // Ensure selected value is controlled
            aria-required
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
        {/* <div className="form_input_box">
          <label htmlFor="current_password">Current Password</label>
          <Input.Password
            required
            id="current_password"
            placeholder="Enter Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
        </div> */}
        <div className="form_input_box">
          <label htmlFor="new_email">New Email</label>
          <Input
            id="new_email"
            placeholder="Enter New Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
        </div>
      </div>
    </form>
  );
};

const ReqPayoutForm = ({loginId, setLoginId, amount, setAmount, reason, setReason}) => {
  return (
    <form className="userSupportForm_reqPayoutForm">
      <div className="req_form_inputFields">
        <div className="form_input_box">
          <label htmlFor="logIn_id">Log in ID</label>
          <Input
            id="logIn_id"
            placeholder="Enter Log in ID"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
          />
        </div>
        <div className="form_input_box">
          <label htmlFor="amount">Amount</label>
          <Input
            id="amount"
            placeholder="Enter Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="form_input_box">
          <label htmlFor="reason">Reason</label>
          <TextArea
            id="reason"
            showCount
            maxLength={100}
            placeholder="Enter Reason"
            value={reason}
            className="textarea"
            onChange={(e) => setReason(e.target.value)}
            style={{
              height: 93,
              resize: "none",
              border: "none !important",
            }}
          />
        </div>
      </div>
    </form>
  );
};

export default UserSupport;
