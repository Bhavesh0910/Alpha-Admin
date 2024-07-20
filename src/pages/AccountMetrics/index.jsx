import {Breadcrumb, Radio, Tabs} from "antd";
import React, {useState} from "react";
import "./style.scss";
import {Link} from "react-router-dom";
import profileIcon from "../../assets/icons/profileIcon.svg";
import BalanceChart from "./Charts/BalanceChart";
import ProfitChart from "./Charts/ProfitChart";
import AccountOverview from "./InnerPages/AccountOverview/AccountOverview";
import Insights from "./InnerPages/Insights/Insights";
import TraderJournal from "./InnerPages/TraderJournal/TraderJournal";
import Analysis from "./InnerPages/Analysis/Analysis";

const AccountMetrics = () => {
  const [status, setStatus] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const onChangeActive = (e) => {
    setPageNo(1);
    setStatus(e.target.value);
  };

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
                    id
                  </Link>
                ),
              },
            ]}
          />
          <div className="trader-overview-header-right tabs_wrapper">
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
        </div>

        {status === "" && <AccountOverview />}
        {status === "Insights" && <Insights />}
        {status === "Trader_Journal" && <TraderJournal />}
        {status === "Analysis" && <Analysis />}
      </div>
    </>
  );
};

export default AccountMetrics;
