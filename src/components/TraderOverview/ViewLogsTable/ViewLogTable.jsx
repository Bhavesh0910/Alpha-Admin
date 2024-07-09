import React, { useState } from "react";
import { Radio, Breadcrumb, Card, Table } from "antd";
import "./ViewLogTable.scss";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
const ViewLogTable = () => {
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
      title: "Platform",
      dataIndex: "platform",
      key: "platform",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
  ];

  const data = [
    {
      key: "1",
      adminEmail: "admin@example.com",
      dateTime: "2024-06-30 14:30:00",
      userID: "123456",
      platform: "Web",
      description: "User accessed dashboard",
    },
    {
      key: "2",
      adminEmail: "admin@example.com",
      dateTime: "2024-06-30 15:00:00",
      userID: "789012",
      platform: "Mobile",
      description: "User logged out",
    },
  ];

  return (
    <Card className="table-wrapper viewLogs_table">
      <div className="header_wrapper">
        <Breadcrumb
          separator=">"
          items={[
            {
              title: <a href="/trader-overview">Trader Overview</a>,
            },
            {
              title: <a href="">Log</a>,
            },
          ]}
        />
        <Radio.Group value={size} onChange={onChange}>
          <Radio.Button value="evaluation">Evaluation</Radio.Button>
          <Radio.Button value="free-trial">Free Trial</Radio.Button>
        </Radio.Group>
      </div>
      <AntTable columns={columns} data={data} />
    </Card>
  );
};

export default ViewLogTable;
