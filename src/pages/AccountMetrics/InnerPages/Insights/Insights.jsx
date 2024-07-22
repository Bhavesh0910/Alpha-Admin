import React, {useEffect, useState} from "react";
import "./Insights.scss";
import {Radio} from "antd";
import { fetchAccountInsights } from "../../../../store/NewReducers/amSlice";
import { useDispatch, useSelector } from "react-redux";

const Insights = ({login_id , platform}) => {
  const [insightTab, setInsightTab] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const onChangeActive = (e) => {
    setPageNo(1);
    setInsightTab(e.target.value);
  };

  console.log(login_id , platform) 
  const idToken = useSelector((state) => state.auth.idToken);
  const dispatch = useDispatch();
  const {accountInsights , isLoading, error } = useSelector(state => state.accountMetrics);
  useEffect(() => {

    dispatch(fetchAccountInsights({ login_id , platform ,idToken }));
  }, [dispatch, login_id, platform, idToken]);

  return (
    <>
      <div className="insights_main">
        {/* Tabination */}
        <div className="trader-overview-header-right tabs_wrapper">
          <Radio.Group
            value={insightTab}
            onChange={onChangeActive}
          >
            <Radio.Button value="">Advanced Statistics</Radio.Button>
            <Radio.Button value="Insights">Risk Insights</Radio.Button>
          </Radio.Group>
        </div>

        {/* Main Container */}
        <div className="insights_main_container">
          <div className="insights_main_header">
            <h2>Advanced Statistics</h2>
          </div>

          <div className="insights_main_inner">
            <div className="insights_main_left">
              <div>
                <p>Trades</p>
                <p>16</p>
              </div>
              <div>
                <p>Trades</p>
                <p>16</p>
              </div>
              <div>
                <p>Trades</p>
                <p>16</p>
              </div>
              <div>
                <p>Trades</p>
                <p>16</p>
              </div>
              <div>
                <p>Trades</p>
                <p>16</p>
              </div>
              <div>
                <p>Trades</p>
                <p>16</p>
              </div>
              <div>
                <p>Trades</p>
                <p>16</p>
              </div>
              <div>
                <p>Trades</p>
                <p>16</p>
              </div>
            </div>

            <div className="insights_main_right">
              <div>
                <p>Trades</p>
                <p>16</p>
              </div>
              <div>
                <p>Trades</p>
                <p>16</p>
              </div>
              <div>
                <p>Trades</p>
                <p>16</p>
              </div>
              <div>
                <p>Trades</p>
                <p>16</p>
              </div>
              <div>
                <p>Trades</p>
                <p>16</p>
              </div>
              <div>
                <p>Trades</p>
                <p>16</p>
              </div>
              <div>
                <p>Trades</p>
                <p>16</p>
              </div>
              <div>
                <p>Trades</p>
                <p>16</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Insights;
