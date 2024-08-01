import React, { useEffect, useState } from "react";
import { Breadcrumb, Card } from "antd";
import { useDispatch, useSelector } from "react-redux";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import { logsListReq } from "../../../store/NewReducers/logsSlice";
import LoaderOverlay from "../../../ReusableComponents/LoaderOverlay";
import moment from "moment"; 

const CompetitionListLogs = () => {
  const { idToken } = useSelector((state) => state.auth);
  const { competitionLogData, count, isLoading } = useSelector((state) => state.logs);

  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const dispatch = useDispatch();

  useEffect(() => {
    const baseurl = "v3/competition-log/list/"; 
    const query = `?page=${pageNo}&page_size=${pageSize}`;
    const url = baseurl + query;
    dispatch(logsListReq({ idToken, url, key: "competitionLogData", dispatch }));
  }, [pageNo, pageSize, idToken, dispatch]);

  const columns = [
    {
      title: "Admin Email ID",
      dataIndex: "admin_email",
      key: "admin_email",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Date and Time",
      dataIndex: "date_time",
      key: "date_time",
      render: (text) => (
        <div className="date_format">
          <div>{text ? moment(text).format("DD/MM/YYYY") : "-"}</div>
          <div>{text ? moment(text).format("hh:mm:ss") : "-"}</div>
        </div>
      ),
    },
    {
      title: "Competition Name",
      dataIndex: "competition_name",
      key: "competition_name",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Challenge",
      dataIndex: "challenge",
      key: "challenge",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Schedule Competition",
      dataIndex: "schedule_competition",
      key: "schedule_competition",
      render: (text) => (text ? moment(text).format("DD/MM/YYYY HH:mm:ss") : "-"),
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
      render: (text) => (text ? moment(text).format("DD/MM/YYYY") : "-"),
    },
    {
      title: "End Date",
      dataIndex: "end_date",
      key: "end_date",
      render: (text) => (text ? moment(text).format("DD/MM/YYYY") : "-"),
    },
    {
      title: "1st Prize",
      dataIndex: "first_prize",
      key: "first_prize",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "2nd Prize",
      dataIndex: "second_prize",
      key: "second_prize",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "3rd Prize",
      dataIndex: "third_prize",
      key: "third_prize",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Competition Rule",
      dataIndex: "competition_rule",
      key: "competition_rule",
      render: (text) => (text ? text : "-"),
    },
  ];

  function triggerChange(page, updatedPageSize) {
    setPageNo(page);
    setPageSize(updatedPageSize);
  }

  return (
    <Card className="table-wrapper viewLogs_table">
      <div className="header_wrapper">
        <Breadcrumb
          separator=">"
          items={[
            {
              title: <a href="#">Competition List</a>,
            },
            {
              title: <a href="#">Log</a>,
            },
          ]}
        />
      </div>
      {isLoading ? (
        <LoaderOverlay />
      ) : (
        <AntTable
          columns={columns}
          data={competitionLogData || []}
          totalPages={Math.ceil(count / pageSize)}
          totalItems={count}
          pageSize={pageSize}
          CurrentPageNo={pageNo}
          setPageSize={setPageSize}
          triggerChange={triggerChange}
        />
      )}
    </Card>
  );
};

export default CompetitionListLogs;
