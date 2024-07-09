import { Breadcrumb, Button, Card } from "antd";
import React, { useState } from "react";
import exportIcon from "../../../assets/icons/export_now_icon_white.svg";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import "./AffiliateMarketingExportHistory.scss";
import moment from "moment/moment";
const AffiliateMarketingExportHistory = () => {
  const [size, setSize] = useState("small");
  const onChange = (e) => {
    setSize(e.target.value);
  };

  const columns = [
    {
      title: "Admin Email ID",
      dataIndex: "adminEmail",
      key: "adminEmail",
    },
    {
      title: "Date and Time",
      dataIndex: "dateTime",
      key: "dateTime",
      render: (text) => (
        <>
          <div className="date_format">
            <div>{moment(text).format("DD/MM/YYYY")} </div>
            <div>{moment(text).format("hh:mm:ss")} </div>
          </div>
        </>
      ),
    },
    {
      title: "Export History",
      dataIndex: "exportHistory",
      key: "exportHistory",
      render: () => (
        <>
          <div className="export_history_btn">
            <Button>
              Example.xlsx
              <img src={exportIcon} alt="export_icon" />
            </Button>
          </div>
        </>
      ),
    },
  ];

  const data = [
    {
      key: "1",
      adminEmail: "admin@example.com",
      dateTime: "2024-06-30 14:30:00",
      userID: "123456",
    },
    {
      key: "2",
      adminEmail: "admin@example.com",
      dateTime: "2024-06-30 15:00:00",
      userID: "789012",
    },
  ];

  return (
    <Card className="table-wrapper viewLogs_table">
      <div className="header_wrapper">
        <Breadcrumb
          separator=">"
          items={[
            {
              title: <a href="/affiliate-marketing/">Affiliate List</a>,
            },
            {
              title: <a href="">Export History</a>,
            },
          ]}
        />
      </div>
      <AntTable columns={columns} data={data} />
    </Card>
  );
};

export default AffiliateMarketingExportHistory;
