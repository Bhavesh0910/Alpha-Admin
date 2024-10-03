import React, { useEffect, useMemo, useState } from "react";
import { Breadcrumb } from "antd";
import { useDispatch, useSelector } from "react-redux";
import AntTable from "../../../../ReusableComponents/AntTable/AntTable";
import LoaderOverlay from "../../../../ReusableComponents/LoaderOverlay";
import { logsListReq } from "../../../../store/NewReducers/logsSlice";
import { Link } from "react-router-dom";
import dayjs from 'dayjs';

const UserIPLogs = () => {
  const { idToken } = useSelector((state) => state.auth);
  const { ipLogData, count, isLoading } = useSelector((state) => state.logs);

  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const dispatch = useDispatch();

  useEffect(() => {
    const query = `?page=${pageNo}&page_size=${pageSize}&category=BLOCKIP`;
    dispatch(logsListReq({ idToken, url: query, key: "ipLogData", dispatch }));
  }, [pageNo, pageSize, idToken, dispatch]);

  const transformedData = (ipLogData || []).map((log) => ({
    admin_email: log.admin_user?.email || "-",
    date_time: log.created_at ? dayjs(log.created_at).format('YYYY-MM-DD HH:mm:ss') : "-",
    user_id: log.user_reference || "-",
    comment: log.meta_data?.reason_for_block || "-",
    network: log.meta_data?.network || "-",
    action: log.action || "-",  // Adding action information
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
      title: "Reason For Block",
      dataIndex: "comment",
      key: "comment",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Network",
      dataIndex: "network",
      key: "network",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text) => (text ? text : "-"),  
    },
  ], []);

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
              title: <Link to="/list/user-ip-list">IP List</Link>,
            },
            {
              title: <Link to="#">Log</Link>,
            },
          ]}
        />
      </div>
      {isLoading ? (
        <LoaderOverlay />
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

export default UserIPLogs;
