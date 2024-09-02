import React, {useState} from "react";
import {Typography, Radio, DatePicker} from "antd";
import "./style.scss";
import {Infobox} from "../../../../components/RiskManagement/NewComponents/Trading stats/General";
import {Volume} from "../../../../components/RiskManagement/NewComponents/Trading stats/Volume";
const {Title} = Typography;
const {RangePicker} = DatePicker;
function Trading_stats() {
  const [selectedMenu, setSelectedMenu] = useState("General");

  const handleMenuChange = (e) => {
    setSelectedMenu(e.target.value);
  };
  return (
    <div className="TradingStats_wrapper">
      <div className="header_box_Trading_stats">
        <div className="header_box_row2">
          <div>
            <Radio.Group onChange={handleMenuChange}>
              <Radio.Button
                value="General"
                className={selectedMenu === "General" ? "selected" : ""}
              >
                General
              </Radio.Button>
              <Radio.Button
                value="Volume"
                className={selectedMenu === "General" ? "selected" : ""}
              >
                Volume
              </Radio.Button>
            </Radio.Group>
          </div>
        </div>
        <div className="Trading_stats_body"></div>
        {/* <Infobox/> */}
        {selectedMenu === "General" ? <Infobox /> : <Volume />}
      </div>
    </div>
  );
}

export default Trading_stats;
