import {Breadcrumb, Radio, Tabs} from "antd";
import React, {useEffect, useState} from "react";
import "./style.scss";
import {Link, useParams} from "react-router-dom";
import profileIcon from "../../assets/icons/profileIcon.svg";
import BalanceChart from "./Charts/BalanceChart";
import ProfitChart from "./Charts/ProfitChart";
import AccountOverview from "./InnerPages/AccountOverview/AccountOverview";
import Insights from "./InnerPages/Insights/Insights";
import TraderJournal from "./InnerPages/TraderJournal/TraderJournal";
import Analysis from "./InnerPages/Analysis/Analysis";
import { fetchAccountDetails, fetchAccountInsights, fetchObjectives, fetchTradeJournal, fetchTradingAccountOverview } from "../../store/NewReducers/amSlice";
import { useDispatch, useSelector } from "react-redux";

const AccountMetrics = () => {
  const [status, setStatus] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const onChangeActive = (e) => {
    setPageNo(1);
    setStatus(e.target.value);
  };
  const { login_id , platform } = useParams();
  console.log(login_id , platform) 
  const idToken = useSelector((state) => state.auth.idToken);
  const dispatch = useDispatch();
  const { tradingAccountOverview, accountDetails, objectives, accountInsights , isLoading, error } = useSelector(state => state.accountMetrics);
  useEffect(() => {
    dispatch(fetchTradingAccountOverview({ login_id, platform, idToken }));
    dispatch(fetchAccountDetails({ login_id, platform, idToken }));
    dispatch(fetchObjectives({ login_id, platform, idToken }));
    // dispatch(fetchAccountInsights({ login_id , platform ,idToken }));
    dispatch(fetchTradeJournal({ login_id , platform , idToken  }));
  }, [dispatch, login_id, platform, idToken]);



  return (
    <>
      <div className="AccountMetrics_main">
        <div className="AccountMetrics_header">
          {/* BreadCrums */}
          <Breadcrumb
            separator=">"
            items={[
              {
                title: (
                  <Link
                    className="page_header"
                    to="/"
                  >
                    Trader View
                  </Link>
                ),
              },
              {
                title: (
                  <Link
                    className="breadcrumb"
                    to=""
                  >
                    {login_id}
                  </Link>
                ),
              },
            ]}
          />

          <Radio.Group
            value={status}
            onChange={onChangeActive}
          >
            <Radio.Button value="">Account Overview</Radio.Button>
            <Radio.Button value="Insights">Insights</Radio.Button>
            <Radio.Button value="Trader_Journal">Trader Journal</Radio.Button>
            <Radio.Button value="Analysis">Analysis</Radio.Button>
          </Radio.Group>

          {/* <Button
            // onClick={() => navigate("view-logs")}
            className="view_logs__btn standard_button"
          >
            View Logs
          </Button> */}
        </div>

        {status === "" && <AccountOverview overview={tradingAccountOverview} accountDetails={accountDetails} objectives={objectives} />}
        {status === "Insights" && <Insights login_id={login_id} platform={platform} />}
        {status === "Trader_Journal" && <TraderJournal login_id={login_id} platform={platform} />}
        {status === "Analysis" && <Analysis />}
      </div>
    </>
  );
};

export default AccountMetrics;
