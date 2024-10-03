import React, { useEffect, useMemo, useState } from "react";
import { Breadcrumb } from "antd";
import { useDispatch, useSelector } from "react-redux";
import AntTable from "../../../../ReusableComponents/AntTable/AntTable";
import LoaderOverlay from "../../../../ReusableComponents/LoaderOverlay";
import "./UserListLogs.scss"; 
import { logsListReq } from "../../../../store/NewReducers/logsSlice";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { Link } from "react-router-dom";

dayjs.extend(utc);
dayjs.extend(timezone);

const UserListLogs = () => {
  const { idToken } = useSelector((state) => state.auth);
  const { userLogData, count, isLoading, isError } = useSelector((state) => state.logs);

  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const dispatch = useDispatch();

  useEffect(() => {
    const query = `?page=${pageNo}&page_size=${pageSize}`;
    const url = query;
    if (idToken) {
      dispatch(logsListReq({ idToken, url, key: "userLogData", dispatch }));
    }
  }, [pageNo, pageSize, idToken, dispatch]);

  const transformedData = (userLogData || []).map((log) => ({
    admin_email: log.admin_user?.email || "-", // Extracting admin email
    date_time: log.created_at ? dayjs(log.created_at).format('YYYY-MM-DD HH:mm:ss') : "-", // Formatting created_at timestamp
    status: log.meta_data?.status || "-", // Extracting status from meta_data
    category: log.category || "-", // Extracting category
    action: log.action || "-", // Extracting action
    user_reference: log.user_reference || "-", // Extracting user reference
    account_reference: log.account_reference || "-", // Extracting account reference
  }));

  const columns = useMemo(() => [
    {
      title: "Admin Email ID",
      dataIndex: "admin_email",
      key: "admin_email",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Created at",
      dataIndex: "date_time",
      key: "date_time",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "User Reference",
      dataIndex: "user_reference",
      key: "user_reference",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Account Reference",
      dataIndex: "account_reference",
      key: "account_reference",
      render: (text) => (text ? text : "-"),
    },
  ]);

  function triggerChange(page, updatedPageSize) {
    setPageNo(page);
    setPageSize(updatedPageSize);
  }

  return (
    <div className="table-wrapper viewLogs_table">
      <div className="header_wrapper">
        <Breadcrumb
          separator=">"
          items={[
            {
              title: <Link to="/list/user-list">User List</Link>,
            },
            {
              title: <Link to="#">Log</Link>,
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
          data={transformedData}
          totalPages={Math.ceil(count / pageSize)}
          totalItems={count}
          pageSize={pageSize}
          CurrentPageNo={pageNo}
          setPageSize={setPageSize}
          triggerChange={triggerChange}
        />
      )}
    </div>
  );
};

export default UserListLogs;
