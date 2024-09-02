import React, { useState } from "react";
import { Typography, Radio } from "antd";
import OverView from "./Overview/Overview";
import Trading_stats from "./Trading stats/index";
import TradingTagList from "./TradingTagList/index";
import "./style.scss"

const { Title } = Typography;

function NewRiskManagement() {
  const [selectedPage, setSelectedPage] = useState("Overview");

  const handlePageChange = (e) => {
    setSelectedPage(e.target.value);
  };

  return (
    <div className="risk_management_wrapper">
   
        <div className="header_box_row1">
          <Title style={{ color: "#1E1E1E" }} level={4}>
            {selectedPage}
          </Title>
          <div>
            <Radio.Group onChange={handlePageChange} value={selectedPage}>
              <Radio.Button value="Overview">Overview</Radio.Button>
              <Radio.Button value="Trading Stats">Trading Stats</Radio.Button>
              <Radio.Button value="Trading Tags List">Trading Tags List</Radio.Button>
            </Radio.Group>
          </div>

      </div>
      <div className="content">
        {selectedPage === "Overview" && <OverView />}
        {selectedPage === "Trading Stats" && <Trading_stats />}
        {selectedPage === "Trading Tags List" && <TradingTagList />}
      </div>
    </div>
  );
}

export default NewRiskManagement;
