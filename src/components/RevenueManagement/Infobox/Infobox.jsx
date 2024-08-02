import React, {useState} from "react";
import "./Infobox.scss";
import totalAccIcon from "../../../assets/icons/totalAccIcon.svg";
import revenueAccIcon from "../../../assets/icons/revenueAccIcon.svg";
import payoutReqIcon from "../../../assets/icons/payoutReqIcon.svg";
import alphaProfitIcon from "../../../assets/icons/alphaProfitIcon.svg";
import netProfitIcon from "../../../assets/icons/netProfitIcon.svg";
import netRevenueIcon from "../../../assets/icons/netRevenueIcon.svg";
import {useSelector} from "react-redux";

const Infobox = () => {
  const {statsData, isLoading} = useSelector((state) => state.revenue);

  const dummyData = [
    {
      totalAccounts: "25,656",
      revenueFromAccountPayments: "$256,560",
      payoutsRequested: "$65,56",
      alphaProfitShare: "$65,56",
      netRevenue: "$565,56",
      netProfit: "$126,56",
    },
  ];

  console.log(statsData, " statsdata");

  return (
    <>
      <div className="infobox_container">
        <div className="infobox_wrapper">
          <div className="infobox_data">
            {statsData &&
              [statsData]?.map((item, index) => (
                <InfoBox
                  key={index}
                  item={item}
                />
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

const InfoBox = ({item}) => {
  return (
    <div className="infobox_wrapper">
      <div className="infobox_content">
        <img
          className="infobox_icon"
          src={totalAccIcon}
          alt="totalAccIcon"
        />
        <p className="infobox_label">Total Accounts</p>
        <p className="infobox_value">{item.total_accounts}</p>
      </div>
      <div className="infobox_content">
        <img
          className="infobox_icon"
          src={revenueAccIcon}
          alt="revenueAccIcon"
        />
        <p className="infobox_label">Revenue from Account Payments</p>
        <p className="infobox_value">{item.revenue_from_payments}</p>
      </div>
      <div className="infobox_content">
        <img
          className="infobox_icon"
          src={payoutReqIcon}
          alt="payoutReqIcon"
        />
        <p className="infobox_label">Payouts Requested</p>
        <p className="infobox_value">{item.payouts_requested}</p>
      </div>
      <div className="infobox_content">
        <img
          className="infobox_icon"
          src={alphaProfitIcon}
          alt="alphaProfitIcon"
        />
        <p className="infobox_label">Alpha Profit Share</p>
        <p className="infobox_value">{item.alpha_profit_share}</p>
      </div>
      <div className="infobox_content">
        <img
          className="infobox_icon"
          src={netRevenueIcon}
          alt="netRevenueIcon"
        />
        <p className="infobox_label">Net Revenue</p>
        <p className="infobox_value">{item.net_revenue}</p>
      </div>
      <div className="infobox_content">
        <img
          className="infobox_icon"
          src={netProfitIcon}
          alt="alphaProfitIcon"
        />
        <p className="infobox_label">Net Profit</p>
        <p className="infobox_value">{item.net_profit}</p>
      </div>
    </div>
  );
};

export default Infobox;
