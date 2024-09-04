import React, {useMemo, useState} from "react";
import {Typography, Radio, DatePicker, Dropdown, Space, Menu} from "antd";
import "./style.scss";

import filterIcon from "../../../../assets/icons/fiterIcon.svg";
import AntTable from "../../../../ReusableComponents/AntTable/AntTable";

const {Title} = Typography;
function TradingTagList() {
  const columns = useMemo(()=>[
    {
      title: "Sr. no.",
      dataIndex: "sr_no",
      key: "sr_no",
      width: 150,
    },
    {
      title: "Email Id",
      dataIndex: "email_id",
      key: "email_id",
      width: 150,
    },
    {
      title: "Username",
      dataIndex: "name",
      key: "name",
      width: 150,
    },
    {
      title: "Profit %",
      dataIndex: "profit",
      key: "profit",
      width: 150,
    },
    {
      title: "Payout",
      dataIndex: "payout",
      key: "payout",
      width: 150,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 150,
    },
  ]);

  const menu = (
    <Menu className="TradingTagList_filters">
      <Menu.Item key="TraderProfit1">Trader profit 5% - 9.9% </Menu.Item>
      <Menu.Item key="TraderProfit2">Trader profit 10% +</Menu.Item>
      <Menu.Item key="TraderPayouts">Trader with 3+ payouts</Menu.Item>
      <Menu.Item key="CustomTagged">Custom Tagged</Menu.Item>
    </Menu>
  );
  return (
    <div className="TradingTagList_wrapper">
      <div className="header_box_Trading_Tag_List">

        <div className="header_box_row2">
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
        <div className="Trading_Tag_List_body"></div>
        <AntTable columns={columns} />
      </div>
    </div>
  );
}

export default TradingTagList;
