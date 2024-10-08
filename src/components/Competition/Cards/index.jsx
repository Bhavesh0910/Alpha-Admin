import React from "react";
import "./style.scss";
import compicon from "../../../assets/images/competition.svg";
import fundingicon from "../../../assets/images/fundingIcon.svg";
import lossicon from "../../../assets/images/lossIcon.svg";
import winicon from "../../../assets/images/winIcon.svg";
import winnericon from "../../../assets/images/currentWinnerIcon.svg";
import total from "../../../assets/images/total.svg";
import {useSelector} from "react-redux";
const Cards = () => {
  const {compDashboard, compTableData} = useSelector((state) => state.comp);
//   console.log("compDashboard", compDashboard);
  return (
    <div className="Cards_wrapper">
      <div className="Cards_content">
        <div className="Cards_content_wrapper">
          <img
            className="Cards_icon"
            src={compicon}
          />
          <p className="Cards_label">Equity</p>
        </div>

        <p className="Cards_value">{compDashboard?.user?.balance_equity?.equity && compDashboard?.user?.balance_equity?.equity}</p>
      </div>
      <div className="Cards_content">
        <div className="Cards_content_wrapper">
          <img
            className="Cards_icon"
            src={fundingicon}
          />
          <p className="Cards_label">Balance</p>
        </div>
        <p className="Cards_value">{compDashboard?.user?.balance_equity?.balance && compDashboard?.user?.balance_equity?.balance}</p>
      </div>
      <div className="Cards_content">
        <div className="Cards_content_wrapper">
          <img
            className="Cards_icon"
            src={lossicon}
          />
          <p className="Cards_label">P&L</p>
        </div>
        <p className="Cards_value">{compDashboard?.user?.total_returns && compDashboard?.user?.total_returns.toFixed(2)}</p>
      </div>
      <div className="Cards_content">
        <div className="Cards_content_wrapper">
          <img
            className="Cards_icon"
            src={winicon}
          />
          <p className="Cards_label">Win Rate</p>
        </div>
        <p className="Cards_value">{compDashboard?.user?.win_rate && (compDashboard?.user?.win_rate).toFixed(2)}</p>
      </div>
      <div className="Cards_content">
        <div className="Cards_content_wrapper">
          <img
            className="Cards_icon"
            src={winnericon}
          />
          <p className="Cards_label">Current Winner</p>
        </div>
        <p className="Cards_value">{compTableData && compTableData[0]?.name}</p>
      </div>
      <div className="Cards_content">
        <div className="Cards_content_wrapper">
          <img
            className="Cards_icon"
            src={total}
          />
          <p className="Cards_label">Total Contestants</p>
        </div>
        <p className="Cards_value">{compDashboard?.user?.total_contestants && compDashboard?.user?.total_contestants}</p>
      </div>
    </div>
  );
};

export default Cards;
