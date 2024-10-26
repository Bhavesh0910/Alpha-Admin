import React, {useEffect, useMemo} from "react";
import AntTable from "../../../../ReusableComponents/AntTable/AntTable";
import moment from "moment";
import {useDispatch, useSelector} from "react-redux";
import {fetchUserNotesData} from "../../../../store/NewReducers/Support";
import {useParams} from "react-router";

const UserNotesTable = () => {
  const {id} = useParams();
  const {idToken} = useSelector((state) => state.auth);
  const {userNotes, isLoading} = useSelector((state) => state.support);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserNotesData({idToken, id}));
  }, []);

  //  console.log(userNotes)

  const paymentColumns = useMemo(() => [
    {
      title: "Admin Email ID",
      dataIndex: "email",
      key: "email",
      width: 200,
      render: (text, record) => (record?.admin_user?.email ? <a href={`mailto:${text}`}>{record?.admin_user?.email}</a> : "-"),
    },
    {
      title: "Date and Time",
      dataIndex: "date_time",
      key: "date_time",
      width: 180,
      render: (text, record) => (record?.admin_user?.date_joined ? moment(record?.admin_user?.date_joined).format("MM/DD/YYYY HH:mm:ss") : "-"),
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

  // const paymentData = [
  //   {
  //     admin_email: "georgia.ku@example.com",
  //     date_time: "2024-07-02T04:07:43Z",
  //     stage: "Stage 1",
  //     action: "Payout",
  //     comments: "May be involved in latency trading violation",
  //   },
  //   {
  //     admin_email: "debra.holt@example.com",
  //     date_time: "2024-07-02T04:07:43Z",
  //     stage: "Stage 2",
  //     action: "Payout",
  //     comments: "May be involved in latency trading violation",
  //   },
  //   {
  //     admin_email: "michelle@example.com",
  //     date_time: "2024-07-02T04:07:43Z",
  //     stage: "Stage 3",
  //     action: "Payout",
  //     comments: "May be involved in latency trading violation",
  //   },
  //   {
  //     admin_email: "tanya.hill@example.com",
  //     date_time: "2024-07-02T04:07:43Z",
  //     stage: "Funded",
  //     action: "Payout",
  //     comments: "May be involved in latency trading violation",
  //   },
  //   {
  //     admin_email: "deancurtis@example.com",
  //     date_time: "2024-07-02T04:07:43Z",
  //     stage: "-",
  //     action: "Payout",
  //     comments: "May be involved in latency trading violation",
  //   },
  // ];

  return (
    <div className="UserNotesTableContainer">
      <div className="UserNotesTableWrapper">
        <AntTable
          columns={paymentColumns || []}
          data={userNotes || []}
          serverSide={false}
        />
      </div>
    </div>
  );
};

export default UserNotesTable;
