import { Breadcrumb, Card } from "antd";
import React, { useState } from "react";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import "./FundingEvaluationLogs.scss";
const FundingEvaluationLogs = () => {
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
      title: "Account no.",
      dataIndex: "accountNo",
      key: "accountNo",
    },
    {
      title: "Password",
      dataIndex: "password",
      key: "password",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Raw Spread",
      dataIndex: "rawSpread",
      key: "rawSpread",
    },
    {
      title: "Funding evaluation",
      dataIndex: "fundingEvaluation",
      key: "fundingEvaluation",
    },
    {
      title: "Account Balance",
      dataIndex: "accountBalance",
      key: "accountBalance",
    },
    {
      title: "Stage",
      dataIndex: "stage",
      key: "stage",
      render: (text) => (
        <div className="stage_status_wrapper">
          <p className={text === "funded" ? "funded" : ""}>{text}</p>
        </div>
      ),
    },
  ];

  const dummyData = [
    {
      key: "1",
      adminEmailId: "example@example.com",
      dateTime: "02/07/2024 04:07:43",
      accountNo: "1360",
      password: "Password123",
      email: "exm@example.com",
      rawSpread: "No Commission",
      fundingEvaluation: "Evaluation",
      accountBalance: "$105.55",
      stage: "funded",
    },
  ];

  return (
    <Card className="table-wrapper viewLogs_table">
      <div className="header_wrapper">
        <Breadcrumb
          separator=">"
          items={[
            {
              title: <a href="/funding-evaluation/*">Funding Evaluation</a>,
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

export default FundingEvaluationLogs;
