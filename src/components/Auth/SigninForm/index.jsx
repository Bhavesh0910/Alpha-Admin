import React, {useEffect, useRef, useState} from "react";
import "./style.scss";

import eyeIcon from "../../../assets/icons/eye-icon-white.svg";
import eyeSlashedIcon from "../../../assets/icons/eye-slashed-icon-white.svg";
import logoIcon from "../../../assets/icons/logo_blue_bg.svg";

import {useNavigate} from "react-router-dom";
import {validateEmail, validatePassword} from "../../../utils/helpers/string";
import {useDispatch, useSelector} from "react-redux";
import {authenticate, setAuthenticationStatus} from "../../../store/NewReducers/authSlice";
import {alphaNewLogin} from "../../../utils/api/apis";
import {returnErrors} from "../../../store/reducers/error";
import {formatText} from "../../../utils/string";

import {tailspin} from "ldrs";
import {Checkbox} from "antd";
tailspin.register();

function SigninForm() {
  const [inputValue, setInputValue] = useState({email: "", password: ""});
  const [inputError, setInputError] = useState({email: "", password: ""});
  const [isInputError, setIsInputError] = useState({
    email: false,
    password: false,
  });

  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  let emailRef = useRef(null);
  let passwordRef = useRef(null);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  //
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);
  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setInputValue((prev) => ({...prev, [name]: value}));
  };

  const handleBlur = (e) => {
    const {id} = e.target;
    id === "email" && emailRef.current.classList.remove("input-error");
    id === "password" && passwordRef.current.classList.remove("input-error");
  };

  const handleFocus = (e) => {
    const {id} = e.target;
    setIsInputError((prev) => ({...prev, [id]: false}));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const {email, password} = inputValue;
    setLoading(true);
    // dispatch(authenticate(inputValue));

    alphaNewLogin(inputValue)
      .then((res) => {
        dispatch(setAuthenticationStatus(res));
        setLoading(false);
        navigate("/");
      })
      .catch((err) => {
        console.log("err", err);
        setAuthenticationStatus(false);
        setLoading(false);
        dispatch(returnErrors(formatText(err?.response?.data?.detail) || "Error Logging in! Something went wrong!", err?.response?.status));
      });

    if (email === "") {
      setInputError((prev) => ({
        ...prev,
        email: "Please enter the email!",
      }));
    } else if (!validateEmail(email)) {
      setInputError((prev) => ({
        ...prev,
        email: "The entered email is wrong!",
      }));
    }
    if (password === "") {
      setInputError((prev) => ({
        ...prev,
        password: "Please enter the password!",
      }));
    } else if (!validatePassword(password)) {
      setInputError((prev) => ({
        ...prev,
        // password: "The entered password is wrong!",
        password: "Password must be atleast 8 characters",
      }));
    }

    if (email === "" || !validateEmail(email)) {
      emailRef.current.classList.add("input-error");
      setIsInputError((prev) => ({...prev, email: true}));
    }
    if (password === "" || !validatePassword(password)) {
      passwordRef.current.classList.add("input-error");
      setIsInputError((prev) => ({...prev, password: true}));
    }

    try {
      //
    } catch (err) {}
  };

  return (
    <div className="signinform-container">
      <div className="signinform_wrapper">
        <div className="company-logo">
          <img
            src={logoIcon}
            alt="company-logo"
          />
        </div>
        <div className="signinform-wrapper">
          <div className="signin-form-info">
            <h2 className="form-header">Sign In</h2>
            <p>Welcome Back! Please enter your Details</p>
          </div>
          <form
            className="signinform-innnercontainer"
            onSubmit={handleSubmit}
          >
            <div className="signinform-subcontainer-form">
              <div
                ref={emailRef}
                className="input-wrapper"
              >
                <p className="input-label">Email</p>
                <label className={`${`signinform-container-input `}`}>
                  <input
                    type="text"
                    className="signinform-input-box"
                    name="email"
                    value={inputValue.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Your Email address"
                    id="email"
                  />
                </label>
              </div>

              <div
                ref={passwordRef}
                className="input-wrapper"
              >
                <p className="input-label">Password</p>
                <label className={`${`signinform-container-input `}`}>
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    className="signinform-input-box"
                    name="password"
                    value={inputValue.password}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Password"
                    id="password"
                  />
                  <img
                    style={{cursor: "pointer"}}
                    src={isPasswordVisible ? eyeIcon : eyeSlashedIcon}
                    alt="Toggle password visibility"
                    onClick={() => setIsPasswordVisible((prev) => !prev)}
                  />
                </label>
              </div>
            </div>
            <div className="signinform-submit-options">
              <button
                className="submit-button accent-button"
                type="submit"
                disabled={loading}
                style={{cursor: loading ? "not-allowed" : "pointer"}}
              >
                {loading ? (
                  <l-tailspin
                    size="40"
                    stroke="5"
                    speed="0.9"
                    color="black"
                  ></l-tailspin>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
            <div className="remember-me">
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              >
                Remember me
              </Checkbox>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SigninForm;
