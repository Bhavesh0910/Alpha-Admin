import { Breadcrumb, Card } from "antd";
import React, { useState } from "react";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";

const CompetitionListLogs = () => {
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
      title: "Competitions Name",
      dataIndex: "competitionsName",
      key: "competitionsName",
    },
    {
      title: "Challenge",
      dataIndex: "challenge",
      key: "challenge",
    },
    {
      title: "Schedule Competitions",
      dataIndex: "scheduleCompetitions",
      key: "scheduleCompetitions",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
    },
    {
      title: "1st Prize",
      dataIndex: "firstPrize",
      key: "firstPrize",
    },
    {
      title: "2nd Prize",
      dataIndex: "secondPrize",
      key: "secondPrize",
    },
    {
      title: "3rd Prize",
      dataIndex: "thirdPrize",
      key: "thirdPrize",
    },
    {
      title: "Competition Rule",
      dataIndex: "competitionRule",
      key: "competitionRule",
    },
  ];

  const dummyData = [
    {
      key: "1",
      adminEmailId: "example@example.com",
      dateTime: "02/07/2024 04:07:43",
      competitionsName: "$45.04",
      challenge: "$45.04",
      scheduleCompetitions: "02/07/2024 04:07:43",
      startDate: "02/07/2024 04:07:43",
      endDate: "02/07/2024 04:07:43",
      firstPrize: "$100K Evaluation",
      secondPrize: "$50K Evaluation",
      thirdPrize: "$25K Evaluation",
      competitionRule:
        "1. Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do\n2. Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do\n3. Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do",
    },
  ];

  return (
    <div className="table-wrapper viewLogs_table">
      <div className="header_wrapper">
        <Breadcrumb
          separator=">"
          items={[
            {
              title: <a href="">Competition List</a>,
            },
            {
              title: <a href="">Log</a>,
            },
          ]}
        />
      </div>
      <AntTable columns={columns} data={dummyData} />
    </div>
  );
};

export default CompetitionListLogs;
