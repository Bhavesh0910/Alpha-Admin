import React, { useEffect, useState } from "react";
import "./style.scss";
// import Tabination from "../../../reusableComponents/Tabs";
import RoundedBarChart from "./RoundedBarChart";
import { useSelector } from "react-redux";
import { getPerformanceChartRequest } from "../../../utils/apis/accountsApi";

function TradeReports() {
  const [performanceChart, setPerformanceChart] = useState([]);
  const { idToken } = useSelector((state) => state?.auth);
  const { login_id } = useSelector((state) => state?.accountList);

  const fetchPerformanceChartData = async () => {
    try {
      if (login_id !== null) {
        const response = await getPerformanceChartRequest(idToken, login_id);
        // console.log(response, "setPerformanceChartsetPerformanceChart");
        setPerformanceChart(response);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchPerformanceChartData();
  }, [login_id, idToken]);

  const tabItems1 = [
    { name: "Overall", path: "/overall" },
    { name: "Long", path: "/long" },
    { name: "Short", path: "/short" },
  ];

  const tabItems2 = [
    { name: "Trade Duration", path: "/trade-duration" },
    { name: "Daily", path: "/daily" },
    { name: "Weekly", path: "/weekly" },
    { name: "Monthly", path: "/monthly" },
  ];

  const performance_trade = {
    data: performanceChart?.performance_by_trade_duration?.pnL || [],
    time: performanceChart?.performance_by_trade_duration?.trade_duration || [],
  };
  const trade_Count = {
    data: performanceChart?.trade_count_by_trade_duration?.pnL || [],
    time: performanceChart?.trade_count_by_trade_duration?.trade_duration || [],
  };
  const win_rate = {
    data: performanceChart?.win_rate_by_trade_duration?.win_rate || [],
    time: performanceChart?.win_rate_by_trade_duration?.trade_duration || [],
  };

  return (
    <div className="trade-reports">
      <h2 className="component-heading">Trade Reports</h2>

      <div className="chart-box-wrapper">
        <div className="tabs-wrapper tabs-1">
          {/* <Tabination
            variant={1}
            tabItems={tabItems1}
            showTabs={true}
            activeTab={activeTab1}
            setActiveTab={handleTabChange1}
          /> */}
          <div className="chart-box">
            <h2 className="component-heading">
              Performance By Trade Duration <span className="sub_title"> (Profit vs Time)</span>
            </h2>
            <RoundedBarChart
              color2={"#FF9898"}
              color1={"#8BFB88"}
              data={performance_trade}
            />
          </div>
        </div>

        <div className="tabs-wrapper tabs-2">
          {/* <Tabination
            variant={1}
            tabItems={tabItems2}
            showTabs={true}
            activeTab={activeTab2}
            setActiveTab={handleTabChange2}
          /> */}
          <div className="tabs-2-charts">
            <div className="chart-box">
              <h2 className="component-heading">
                Trade Count By Trade Duration{" "}
                <span className="sub_title">(No. of Trades vs Time)</span>
              </h2>
              <RoundedBarChart
                color2={"#FFF27A"}
                color1={"#FFF27A"}
                data={trade_Count}
              />
            </div>
            <div className="chart-box">
              <h2 className="component-heading">Win Rate By Trade Duration </h2>

              <RoundedBarChart
                color2={"#FF9898"}
                color1={"#8BFB88"}
                data={win_rate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TradeReports;
