import React, { useEffect, useMemo, useState } from "react";
import { Breadcrumb } from "antd";
import { useDispatch, useSelector } from "react-redux";
import "../Funded/FundedLogs/FundedLogs.scss";
import AntTable from "../../ReusableComponents/AntTable/AntTable";
import { logsListReq } from "../../store/NewReducers/logsSlice";
import LoaderOverlay from "../../ReusableComponents/LoaderOverlay";
import { Link } from "react-router-dom";

const Stage1Logs = () => {
  const { idToken } = useSelector((state) => state.auth);
  const { stage1LogsData, count, isLoading } = useSelector((state) => state.logs);

  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const dispatch = useDispatch();

  useEffect(() => {
    const query = `?category=STAGE_1&page=${pageNo}&page_size=${pageSize}`;
    dispatch(logsListReq({ idToken, url: query, key: "stage1LogsData" }));
  }, [pageNo, pageSize, idToken, dispatch]);

  // Transforming the log data
  const transformedData = stage1LogsData.map((log) => ({
    admin_email: log.admin_user.email,
    admin_name: `${log.admin_user.first_name} ${log.admin_user.last_name}`.trim() || "-",
    date_time: new Date(log.created_at).toLocaleString(), 
    account_reference: log.account_reference,
    user_reference: log.user_reference,
    action: log.action,
    category: log.category,
    created_at: new Date(log.created_at).toLocaleString(),
  }));

  const columns = useMemo(() => [
    {
      title: "Admin Name",
      dataIndex: "admin_name",
      key: "admin_name",
      width: 150,
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Admin Email ID",
      dataIndex: "admin_email",
      key: "admin_email",
      width: 150,
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Created at",
      dataIndex: "created_at",
      key: "created_at",
      width: 150,
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
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 150,
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 100,
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
              title: <a href="/support/stage-1">Stage 1</a>,
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
          data={transformedData || []}
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

export default Stage1Logs;
