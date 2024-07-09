import { Breadcrumb, Button, Card } from "antd";
import "./PaymentLogs.scss";
import React, { useState } from "react";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import moment from "moment";

const PaymentLogs = () => {
  const [size, setSize] = useState("small");
  const onChange = (e) => {
    setSize(e.target.value);
  };
  const data = [
    {
      key: "1",
      adminEmail: "admin@example.com",
      dateTime: "2024-06-30 14:30:00",
      userID: "123456",
      status: "in-progress",
    },
    {
      key: "2",
      adminEmail: "admin@example.com",
      dateTime: "2024-06-30 15:00:00",
      userID: "789012",
      status: "approved",
    },
  ];
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
      title: "User ID",
      dataIndex: "userID",
      key: "userID",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <>
          <div className="status_btn_wrapper">
            <div
              className={
                text === "in-progress"
                  ? "in_progress"
                  : text === "approved"
                  ? "approved"
                  : text === "flagged"
                  ? "flagged"
                  : text === "dismissed"
                  ? "dismissed"
                  : ""
              }
            >
              {text === "in-progress"
                ? "In Progress"
                : text === "approved"
                ? "Approved"
                : text === "flagged"
                ? "Flagged"
                : text === "dismissed"
                ? "Dismissed"
                : ""}
            </div>
          </div>
        </>
      ),
    },
  ];

  return (
    <Card className="table-wrapper viewLogs_table">
      <div className="header_wrapper">
        <Breadcrumb
          separator=">"
          items={[
            {
              title: <a href="/payments/">Payments</a>,
            },
            {
              title: <a href="">Log</a>,
            },
          ]}
        />
      </div>
      <AntTable columns={columns} data={data} />
    </Card>
  );
};

export default PaymentLogs;
