import React from "react";
import "./PayoutPaymentTable.scss";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import {Button} from "antd";

const PayoutPaymentTable = () => {
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) => parseFloat(a.amount.replace("$", "").replace("K", "000")) - parseFloat(b.amount.replace("$", "").replace("K", "000")),
    },
    {
      title: "Method",
      dataIndex: "method",
      key: "method",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: () => <Button className="standard_button viewDetails_button">View Details</Button>,
    },
  ];

  const data = [
    {
      key: "1",
      name: "Jane Cooper",
      date: "8/16/13",
      email: "kenzi.lawson@example.com",
      amount: "$300K",
      method: "Swift",
    },
    {
      key: "2",
      name: "Jane Cooper",
      date: "8/16/13",
      email: "kenzi.lawson@example.com",
      amount: "$300K",
      method: "Swift",
    },
    // Add more rows as needed
  ];

  return (
    <AntTable
      columns={columns}
      data={data}
    />
  );
};

export default PayoutPaymentTable;
