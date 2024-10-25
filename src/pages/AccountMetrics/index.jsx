import {Breadcrumb, Radio, Select, Tabs} from "antd";
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
import {
  fetchAccountAnalysis,
  fetchAccountDetails,
  fetchAccountInsights,
  fetchCertificatesDetails,
  fetchObjectives,
  fetchPerformanceChart,
  fetchTradeJournal,
  fetchTradingAccountOverview,
} from "../../store/NewReducers/amSlice";
import {useDispatch, useSelector} from "react-redux";
import LoaderOverlay from "../../ReusableComponents/LoaderOverlay";
import ProfileDetails from "./InnerPages/ProfileDetails/ProfileDetails";
import TransactionHistory from "./InnerPages/TransactionHistory/TransactionHistory";
import AllCertificates from "../Certificates/AllCertificates";
const {Option} = Select;

const AccountMetrics = () => {
  const [status, setStatus] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const onChangeActive = (e) => {
    console.log(" valueee : ", e);
    setPageNo(1);
    setStatus(e?.target?.value);
  };

  const handleMobileFilters = (e) => {
    setPageNo(1);
    setStatus(e);
    console.log("jjj", e);
  };
  const {login_id, platform, user_id} = useParams();

  console.log("platformmmmmmm : ", platform);
  const idToken = useSelector((state) => state.auth.idToken);
  const dispatch = useDispatch();
  const {tradingAccountOverview, accountDetails, accountAnalysis, objectives, performanceChart, accountInsights, isLoading, error} = useSelector((state) => state.accountMetrics);

  console.log(performanceChart);
  useEffect(() => {
    dispatch(fetchTradingAccountOverview({login_id, platform, idToken}));
    dispatch(fetchAccountDetails({login_id, platform, idToken}));
    dispatch(fetchObjectives({login_id, platform, idToken}));
    dispatch(fetchPerformanceChart({login_id, platform, idToken}));

    dispatch(fetchAccountAnalysis({login_id, platform, idToken}));

    // dispatch(fetchAccountInsights({ login_id , platform ,idToken }));
    // dispatch(fetchTradeJournal({ login_id , platform , idToken  }));
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
          <div className="StatusFilters">
            <Radio.Group
              value={status}
              onChange={onChangeActive}
            >
              <Radio.Button value="">Account Overview</Radio.Button>
              <Radio.Button value="Insights">Insights</Radio.Button>
              <Radio.Button value="Profile">Profile Details</Radio.Button>
              <Radio.Button value="Trader_Journal">Trade History</Radio.Button>
              <Radio.Button value="Analysis">Analysis</Radio.Button>
              <Radio.Button value="Transaction">Transaction History</Radio.Button>
              <Radio.Button value="Certificate">Certificate</Radio.Button>
            </Radio.Group>
          </div>
          <div className="mobileFilters">
            <Select
              value={status}
              onChange={handleMobileFilters}
              placeholder="Select a filter"
            >
              <Option
                key={""}
                value={""}
              >
                Account Overview
              </Option>
              <Option
                key="Insights"
                value="Insights"
              >
                Insights
              </Option>
              <Option
                key="Profile"
                value={"Profile"}
              >
                Profile
              </Option>
              <Option
                key="Trader_Journal"
                value={"Trader_Journal"}
              >
                Trade History
              </Option>
              <Option
                key="Analysis"
                value={"Analysis"}
              >
                Analysis
              </Option>
              <Option
                key="Transaction"
                value={"Transaction"}
              >
                Transaction History
              </Option>
              <Option
                key="Certificate"
                value={"Certificate"}
              >
                Certificate
              </Option>
            </Select>
          </div>
          {/* <Button
            // onClick={() => navigate("view-logs")}
            className="view_logs__btn standard_button"
          >
            View Logs
          </Button> */}
        </div>
        {isLoading && <LoaderOverlay />}

        {status === "" && (
          <AccountOverview
            statistics={accountAnalysis?.general_statistics}
            info={accountAnalysis?.Basic_info}
            accountInsights={accountInsights}
            overview={tradingAccountOverview}
            accountDetails={accountDetails}
            objectives={objectives}
            performanceChart={performanceChart}
          />
        )}
        {status === "Insights" && (
          <Insights
            login_id={login_id}
            platform={platform}
          />
        )}
        {status === "Profile" && <ProfileDetails id={user_id} />}
        {status === "Trader_Journal" && (
          <TraderJournal
            login_id={login_id}
            platform={platform}
          />
        )}
        {status === "Analysis" && (
          <Analysis
            login_id={login_id}
            platform={platform}
          />
        )}
        {status === "Transaction" && <TransactionHistory user_id={user_id} />}
        {status === "Certificate" && <AllCertificates user_id={user_id} />}
      </div>
    </>
  );
};

export default AccountMetrics;
