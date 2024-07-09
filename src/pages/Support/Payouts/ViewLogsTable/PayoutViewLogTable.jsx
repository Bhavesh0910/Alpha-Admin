import React, { useState } from "react";
import { Radio, Breadcrumb, Card } from "antd";
import "./PayoutViewLogTable.scss";
import AntTable from "../../../../ReusableComponents/AntTable/AntTable";
import { render } from "react-saga";

const PayoutViewLogTable = () => {
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
    },
    {
      title: "User ID",
      dataIndex: "userID",
      key: "userID",
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
      render: () => (
        <>
          <div className="comment_container">
            <div className="status_box">
              <label>Status:</label>
              <p>New -&gt; In Progress</p>
            </div>
            <div className="action_box">
              <label>Action:</label>
              <p>Accept/Reject</p>
            </div>
            <div className="comment_box">
              <label>Comment:</label>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
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
              title: <a href="/support/payout/">Payout</a>,
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

export default PayoutViewLogTable;
