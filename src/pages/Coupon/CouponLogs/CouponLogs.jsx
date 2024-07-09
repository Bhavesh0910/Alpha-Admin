import { Breadcrumb, Card } from "antd";
import React, { useState } from "react";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";

const CouponLogs = () => {
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
      title: "Coupon Code",
      dataIndex: "couponCode",
      key: "couponCode",
    },
    {
      title: "Add User",
      dataIndex: "addUser",
      key: "addUser",
    },
    {
      title: "Coupon Amount",
      dataIndex: "couponAmount",
      key: "couponAmount",
    },
    {
      title: "Coupon Percentage",
      dataIndex: "couponPercentage",
      key: "couponPercentage",
    },
    {
      title: "Challenge",
      dataIndex: "challenge",
      key: "challenge",
    },
    {
      title: "Coupon Expiry",
      dataIndex: "couponExpiry",
      key: "couponExpiry",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
    },
  ];

  const dummyData = [
    {
      key: "1",
      adminEmailId: "example@example.com",
      dateTime: "02/07/2024 04:07:43",
      couponCode: "Summer25",
      addUser: "example@example.com",
      couponAmount: "$250",
      couponPercentage: "25%",
      challenge: "Alpha Pro 5K",
      couponExpiry: "12/07/2024 10:24",
      status: "Active",
      action: "Public",
    },
  ];

  return (
    <Card className="table-wrapper viewLogs_table">
      <div className="header_wrapper">
        <Breadcrumb
          separator=">"
          items={[
            {
              title: <a href="/coupon">Coupon</a>,
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

export default CouponLogs;
