import React from "react";
import "./style.scss";
import { useSelector } from "react-redux";
const CurrentWinner = () => {
    const {compDashboard}=useSelector((state)=>state.comp);
    return (
    <div className="current_winner_wrapper">
      <h2>{ compDashboard?.user?.name && compDashboard?.user?.name ||"Dashboard Stats"}</h2>
      <div className="current_winner_groups">
        <div className="current_winner_info_groupA">
          <div className="current_winner_info">
            <div className="title">Current Equity</div>
            <p>{compDashboard?.user?.balance_equity?.equity && compDashboard?.user?.balance_equity?.equity}</p>
          </div>
          <div className="current_winner_info">
            <div className="title">Starting Balance</div>
            <p>{compDashboard?.user?.account_size && compDashboard?.user?.account_size}</p>
          </div>
          <div className="current_winner_info">
            <div className="title">% Return</div>
            <p>{compDashboard?.user?.return_percentage && (compDashboard?.user?.return_percentage.toFixed(2))}</p>
          </div>
          <div className="current_winner_info">
            <div className="title">Most traded product</div>
            <p>{compDashboard?.user?.most_traded_product && compDashboard?.user?.most_traded_product}</p>
          </div>
          <div className="current_winner_info">
            <div className="title">Daily loss</div>
            <p>{compDashboard?.user?.max_daily_loss && compDashboard?.user?.max_daily_loss}</p>
          </div>
        </div>
        <div className="current_winner_info_groupB">
          <div className="current_winner_info">
            <div className="title">Current Balance</div>
            <p>{compDashboard?.user?.balance_equity?.balance && compDashboard?.user?.balance_equity?.balance}</p>
          </div>
          <div className="current_winner_info">
            <div className="title">Cummulative PnL</div>
            <p>{compDashboard?.user?.total_returns && compDashboard?.user?.total_returns}</p>
          </div>
          <div className="current_winner_info">
            <div className="title">Largest Winning Trade</div>
            <p>{compDashboard?.user?.largest_winning_trade && compDashboard?.user?.largest_winning_trade}</p>
          </div>
          <div className="current_winner_info">
            <div className="title">Max Loss</div>
            <p>{compDashboard?.user?.max_loss && compDashboard?.user?.max_loss}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWinner;
