import React from "react";
import "./style.scss";
import BackdropTop from "../../../assets/icons/backdrop-top.svg";
import BackdropMiddle from "../../../assets/icons/backdrop-middle.svg";
import BackdropRight from "../../../assets/icons/backdrop-right.svg";
const AuthFrame = () => {
  return (
    <div className="authframe-container">
      <div className="backdrops">
        <img
          className="backdrop-top backdrop_items"
          src={BackdropTop}
          alt="BackdropTop"
        />
        <img
          className="backdrop-middle backdrop_items"
          src={BackdropMiddle}
          alt="BackdropMiddle"
        />
        <img
          className="backdrop-right backdrop_items"
          src={BackdropRight}
          alt="BackdropRight"
        />
      </div>
    </div>
  );
};

export default AuthFrame;
