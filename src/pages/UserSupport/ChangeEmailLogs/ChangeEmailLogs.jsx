import { Breadcrumb, Card } from "antd";
import React, { useState } from "react";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";

const ChangeEmailLogs = () => {
  const [size, setSize] = useState("small");
  const onChange = (e) => {
    setSize(e.target.value);
  };

  const columns = [
    {
      title: "Admin Email ID",
      dataIndex: "adminEmailId",
      key: "adminEmailId",
    },
    {
      title: "Date and Time",
      dataIndex: "dateTime",
      key: "dateTime",
    },
    {
      title: "Current Email",
      dataIndex: "currentEmail",
      key: "currentEmail",
    },
    {
      title: "New Email",
      dataIndex: "newEmail",
      key: "newEmail",
    },
  ];

  const dummyData = [
    {
      key: "1",
      adminEmailId: "tanya.hill@example.com",
      dateTime: "02/07/2024 04:07:43",
      currentEmail: "jessica.hanson@example.com",
      newEmail: "felicia.reid@example.com",
    },
  ];

  return (
    <Card className="table-wrapper viewLogs_table">
      <div className="header_wrapper">
        <Breadcrumb
          separator=">"
          items={[
            {
              title: <a href="/user-support">Change Email</a>,
            },
            {
              title: <a href="">Log</a>,
            },
          ]}
        />
      </div>
      <AntTable columns={columns} data={dummyData} />
    </Card>
  );
};

export default ChangeEmailLogs;
