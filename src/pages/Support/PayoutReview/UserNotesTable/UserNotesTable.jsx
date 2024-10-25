import React, {useMemo} from "react";
import AntTable from "../../../../ReusableComponents/AntTable/AntTable";
import moment from "moment";

const UserNotesTable = () => {
  const paymentColumns = useMemo(() => [
    {
      title: "Admin Email ID",
      dataIndex: "admin_email",
      key: "admin_email",
      width: 200,
      render: (text) => (text ? <a href={`mailto:${text}`}>{text}</a> : "-"),
    },
    {
      title: "Date and Time",
      dataIndex: "date_time",
      key: "date_time",
      width: 180,
      render: (text) => (text ? moment(text).format("MM/DD/YYYY HH:mm:ss") : "-"),
    },
    {
      title: "Stage",
      dataIndex: "stage",
      key: "stage",
      width: 100,
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 100,
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Comments",
      dataIndex: "comments",
      key: "comments",
      width: 300,
      render: (text) => (text ? text : "-"),
    },
  ]);

  const paymentData = [
    {
      admin_email: "georgia.ku@example.com",
      date_time: "2024-07-02T04:07:43Z",
      stage: "Stage 1",
      action: "Payout",
      comments: "May be involved in latency trading violation",
    },
    {
      admin_email: "debra.holt@example.com",
      date_time: "2024-07-02T04:07:43Z",
      stage: "Stage 2",
      action: "Payout",
      comments: "May be involved in latency trading violation",
    },
    {
      admin_email: "michelle@example.com",
      date_time: "2024-07-02T04:07:43Z",
      stage: "Stage 3",
      action: "Payout",
      comments: "May be involved in latency trading violation",
    },
    {
      admin_email: "tanya.hill@example.com",
      date_time: "2024-07-02T04:07:43Z",
      stage: "Funded",
      action: "Payout",
      comments: "May be involved in latency trading violation",
    },
    {
      admin_email: "deancurtis@example.com",
      date_time: "2024-07-02T04:07:43Z",
      stage: "-",
      action: "Payout",
      comments: "May be involved in latency trading violation",
    },
  ];

  return (
    <div className="UserNotesTableContainer">
      <div className="UserNotesTableWrapper">
        <AntTable
          columns={paymentColumns}
          data={paymentData}
        />
      </div>
    </div>
  );
};

export default UserNotesTable;
