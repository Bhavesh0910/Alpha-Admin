import React, { useEffect, useState } from "react";
import { Breadcrumb, Card } from "antd";
import { useDispatch, useSelector } from "react-redux";
import LoaderOverlay from "../../../ReusableComponents/LoaderOverlay";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import moment from "moment";
import { logsListReq } from "../../../store/NewReducers/logsSlice";

const ChangeEmailLogs = () => {
  const { idToken } = useSelector((state) => state.auth);
  const { changeEmailLogData, count, isLoading, isError } = useSelector((state) => state.logs);

  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const dispatch = useDispatch();

  useEffect(() => {
    const baseUrl = "v3/change-email-log/list/";
    const query = `?page=${pageNo}&page_size=${pageSize}`;
    const url = baseUrl + query;
    if (idToken) {
      dispatch(logsListReq({ idToken, url, key: "changeEmailLogData", dispatch }));
    }
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
          <div>{moment(text).format("DD/MM/YYYY")}</div>
          <div>{moment(text).format("HH:mm:ss")}</div>
        </div>
      ),
    },
    {
      title: "Current Email",
      dataIndex: "user_email",
      key: "user_email",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "New Email",
      dataIndex: "new_email",
      key: "new_email",
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
              title: <a href="/user-support">Change Email</a>,
            },
            {
              title: <a href="#">Log</a>,
            },
          ]}
        />
      </div>
      {isLoading ? (
        <LoaderOverlay />
      ) : isError ? (
        <div className="error-message">
          <p>Error loading logs. Please try again later.</p>
        </div>
      ) : (
        <AntTable
          columns={columns}
          data={changeEmailLogData || []}
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

export default ChangeEmailLogs;
