import React, {useEffect, useState} from "react";
import {Typography, Radio, DatePicker, Space, Dropdown, Menu} from "antd";
import "./Overview.scss";
import filterIcon from "../../../../assets/icons/fiterIcon.svg";
import PassRateChart from "../../../../components/RiskManagement/NewComponents/Overview/PassRate/PassRate";
import {Infobox} from "../../../../components/RiskManagement/NewComponents/Overview/infobox";
import MOM_payouts from "../../../../components/RiskManagement/NewComponents/Overview/MoMViewPayouts";
import TotalPayout from "../../../../components/RiskManagement/NewComponents/Overview/Total Payouts"
const {Title} = Typography;
const {RangePicker} = DatePicker;
function OverView() {
  const menu = (
    <Menu className="overview_filters">
      <Menu.Item key="Stage1">Stage1</Menu.Item>
      <Menu.Item key="Stage2">Stage2</Menu.Item>
      <Menu.Item key="Funded Account">Funded Account</Menu.Item>
      <Menu.Item key="8 cap">8 cap</Menu.Item>
    </Menu>
  );
  return (
    <div className="Overview_wrapper">
      <div className="header_box_row">
        <div>
          <RangePicker />
        </div>
        <div className="dropdown_filter">
          <Dropdown
            overlay={menu}
            trigger={["click"]}
          >
            <Space>
              <img src={filterIcon} />
              <p>Filter</p>
            </Space>
          </Dropdown>
        </div>
      </div>
      <div className="Overview_body">
        <div className="Overview_body_row1">
          <div className="PassRateChart">
            <PassRateChart />
          </div>
          <div className="TotalPayout">
            <TotalPayout/>
          </div>
        </div>
        <div className="Overview_body_row2">
          <div className="infobox_container">
            <Infobox />
          </div>
          <div className="payouts">
            <MOM_payouts />
          </div>
        </div>
      </div>
    </div>
  );
}

export default OverView;
