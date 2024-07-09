import { Breadcrumb, Card } from "antd";
import React, { useState } from "react";
import AntTable from "../../../../ReusableComponents/AntTable/AntTable";

const UserListLogs = () => {
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
      title: "Enter Email",
      dataIndex: "enterEmail",
      key: "enterEmail",
    },
    {
      title: "Affiliate Code",
      dataIndex: "affiliateCode",
      key: "affiliateCode",
    },
    {
      title: "Commission",
      dataIndex: "commission",
      key: "commission",
    },
    {
      title: "Repeat Commission",
      dataIndex: "repeatCommission",
      key: "repeatCommission",
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
    },
  ];

  const dummyData = [
    {
      key: "1",
      adminEmailId: "tanya.hill@example.com",
      dateTime: "02/07/2024 04:07:43",
      enterEmail: "jessica.hanson@example.com",
      affiliateCode: "Hawkins025",
      commission: "51%",
      repeatCommission: "12%",
      discount: "4%",
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
export default UserListLogs;
