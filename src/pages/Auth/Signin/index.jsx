import React, { useState } from "react";
import "./style.scss";
import AuthFrame from "../../../components/Auth/AuthFrame";
import SigninForm from "../../../components/Auth/SigninForm";
// import ErrorModal from "../../../Alerts/ErrorModal";

const Signin = () => {
  const [errorModalOpen, setErrorModalOpen] = useState(false);

  return (
    <div className="signin-container">
      <div className="signin-left-wrapper">
        <div className="signin-left-form">
          <SigninForm />
        </div>
      </div>
      <div className="signin-right-wrapper">
        <div className="signin-right-authframe">
          <AuthFrame />
        </div>
      </div>
    </div>
  );
};

export default Signin;
