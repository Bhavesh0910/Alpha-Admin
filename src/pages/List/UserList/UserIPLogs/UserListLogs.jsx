import React, { useEffect, useState } from "react";
import { Breadcrumb, Card } from "antd";
import { useDispatch, useSelector } from "react-redux";
import AntTable from "../../../../ReusableComponents/AntTable/AntTable";
import LoaderOverlay from "../../../../ReusableComponents/LoaderOverlay";
import "./UserListLogs.scss"; 
import { logsListReq } from "../../../../store/NewReducers/logsSlice";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const UserListLogs = () => {
  const { idToken } = useSelector((state) => state.auth);
  const { userLogData, count, isLoading, isError } = useSelector((state) => state.logs);

  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const dispatch = useDispatch();

  useEffect(() => {
    const baseUrl = "v3/user-log/list/";
    const query = `?page=${pageNo}&page_size=${pageSize}`;
    const url = baseUrl + query;
    if (idToken) {
      dispatch(logsListReq({ idToken, url, key: "userLogData", dispatch }));
    }
  }, [pageNo, pageSize, idToken, dispatch]);

  const transformedData = (userLogData || []).map((log) => ({
    ...log,
    status: log.action === 'unblock_user' ? 'blocked' : 
            log.action === 'block_user' ? 'allowed' : '-',
    date_time: log.date_time ? dayjs(log.date_time).format('YYYY-MM-DD HH:mm:ss') : '-',
  }));

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
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (text ? text : "-"),
    },
  ];

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
              title: <a href="/user-ip-list/">User IP List</a>,
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
