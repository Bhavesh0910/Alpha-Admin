import React, { useEffect, useMemo, useState } from "react";
import { Breadcrumb, Card } from "antd";
import { useDispatch, useSelector } from "react-redux";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import LoaderOverlay from "../../../ReusableComponents/LoaderOverlay";
import "./FundedLogs.scss";
import { logsListReq } from "../../../store/NewReducers/logsSlice";
import { Link } from "react-router-dom";

const FundedLogs = () => {
  const { idToken } = useSelector((state) => state.auth);
  const { fundedLogData, count, isLoading } = useSelector((state) => state.logs);

  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const dispatch = useDispatch();

  useEffect(() => {
    const query = `?page=${pageNo}&page_size=${pageSize}&category=MT5_ACCOUNT`;
    dispatch(logsListReq({ idToken, url: query, key: "fundedLogData", dispatch }));
  }, [pageNo, pageSize, idToken, dispatch]);

  const columns = useMemo(() => [
    {
      title: "Admin Email ID",
      dataIndex: ["admin_user", "email"],
      key: "admin_email",
      width: 150,
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Date and Time",
      dataIndex: "created_at",
      key: "created_at",
      width: 150,
      render: (text) => (text ? new Date(text).toLocaleString() : "-"),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 100,
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Account Reference",
      dataIndex: "account_reference",
      key: "account_reference",
      width: 150,
      render: (text) => (text ? text : "-"),
    },
    {
      title: "User Reference",
      dataIndex: "user_reference",
      key: "user_reference",
      width: 150,
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Comment",
      dataIndex: "admin_comment",
      key: "admin_comment",
      width: 200,
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
              title: <a href="/support/funded">Funded</a>,
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
          data={fundedLogData?.results || []} 
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

export default FundedLogs;
