import { Breadcrumb, Card } from "antd";
import React, { useState } from "react";
import invoiceIcon from "../../../assets/icons/payoutInvoiceIcon.svg";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";

const RequestPayout = () => {
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
      title: "Login ID",
      dataIndex: "loginId",
      key: "loginId",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "Invoice",
      dataIndex: "invoice",
      key: "invoice",
      render: (text) => (
        <span>
          <img
            src={invoiceIcon}
            alt="invoice"
            style={{ width: 20, height: 20 }}
          />
        </span>
      ),
    },
  ];

  const dummyData = [
    {
      key: "1",
      adminEmailId: "tanya.hill@example.com",
      dateTime: "02/07/2024 04:07:43",
      loginId: "65563",
      amount: "$630.44",
      reason: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      invoice: "icon", // This should be replaced with the actual path or identifier for the invoice icon
    },
  ];

  return (
    <Card className="table-wrapper viewLogs_table">
      <div className="header_wrapper">
        <Breadcrumb
          separator=">"
          items={[
            {
              title: <a href="/user-support">Request Payout</a>,
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

export default RequestPayout;
