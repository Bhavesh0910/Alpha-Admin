import { Breadcrumb, Card } from "antd";
import React, { useState } from "react";
import AntTable from "../../../../ReusableComponents/AntTable/AntTable";

const UserIPLogs = () => {
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
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
  ];

  const dummyData = [
    {
      key: "1",
      adminEmailId: "georgia.ku@example.com",
      dateTime: "02/07/2024 04:07:43",
      userId: "Example450",
      description:
        "Status: N/A\nAction: Block/Unblock/Delete\nComment: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
  ];

  return (
    <Card className="table-wrapper viewLogs_table">
      <div className="header_wrapper">
        <Breadcrumb
          separator=">"
          items={[
            {
              title: <a href="/user-ip-list/">User IP List</a>,
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
export default UserIPLogs;
