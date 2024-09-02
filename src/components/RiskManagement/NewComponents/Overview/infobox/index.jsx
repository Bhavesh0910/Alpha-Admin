import React from "react";
import "./style.scss";
export const Infobox = () => {
  return (
    <div className="Infobox_wrapper">
      <div className="Infobox_content">
        <img
          className="Infobox_icon"
          src={""}
        />
        <p className="Infobox_label">Total Payoutd</p>
        <p className="Infobox_value">$25000</p>
      </div>
      <div className="Infobox_content">
        <img
          className="Infobox_icon"
          src={""}
        />
        <p className="Infobox_label">Funded accounts current profits</p>
        <p className="Infobox_value">$5550</p>
      </div>
      <div className="Infobox_content">
        <img
          className="Infobox_icon"
          src={""}
        />
        <p className="Infobox_label">No. of active funded accounts</p>
        <p className="Infobox_value">5000</p>
      </div>
      <div className="Infobox_content">
        <img
          className="Infobox_icon"
          src={""}
        />
        <p className="Infobox_label">Pass percentange</p>
        <p className="Infobox_value">30%</p>
      </div>
      <div className="Infobox_content">
        <img
          className="Infobox_icon"
          src={""}
        />
        <p className="Infobox_label">Profit Made Daily</p>
        <p className="Infobox_value">$5600</p>
      </div>
      <div className="Infobox_content">
        <img
          className="Infobox_icon"
          src={""}
        />
        <p className="Infobox_label">Accounts Breach Daily</p>
        <p className="Infobox_value">445</p>
      </div>
    </div>
  );
};
