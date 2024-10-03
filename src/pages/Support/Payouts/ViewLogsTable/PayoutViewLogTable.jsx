import React, { useEffect, useMemo, useState } from "react";
import { Breadcrumb } from "antd";
import { useDispatch, useSelector } from "react-redux";
import AntTable from "../../../../ReusableComponents/AntTable/AntTable";
import LoaderOverlay from "../../../../ReusableComponents/LoaderOverlay";
import { logsListReq } from "../../../../store/NewReducers/logsSlice";
import { Link } from "react-router-dom";

const PayoutViewLogTable = () => {
  const { idToken } = useSelector((state) => state.auth);
  const { payoutLogData, count, isLoading } = useSelector((state) => state.logs);

  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const dispatch = useDispatch();

  useEffect(() => {
    const query = `?category=PAYOUT&page=${pageNo}&page_size=${pageSize}`;
    const url = query;
    dispatch(logsListReq({ idToken, url, key: "payoutLogData", dispatch }));
  }, [pageNo, pageSize, idToken, dispatch]);

  const columns = useMemo(() => [
    {
      title: "Admin Email ID",
      dataIndex: "admin_email",
      key: "admin_email",
      width: 150,
      render: (text, record) => (record.admin_user?.email ? record.admin_user.email : "-"),
    },
    {
      title: "Date and Time",
      dataIndex: "date_time",
      key: "date_time",
      width: 150,
      render: (text, record) => (record.created_at ? new Date(record.created_at).toLocaleString() : "-"),
    },
    {
      title: "Account No.",
      dataIndex: "account_no",
      key: "account_no",
      width: 100,
      render: (text, record) => (record.account_reference ? record.account_reference : "-"),
    },
    {
      title: "User Reference",
      dataIndex: "user_reference",
      key: "user_reference",
      width: 150,
      render: (text, record) => (record.user_reference ? record.user_reference : "-"),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 100,
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (text, record) => (record.meta_data?.status ? record.meta_data.status : "-"),
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
      width: 200,
      render: (text, record) => (record.meta_data?.comment ? record.meta_data.comment : "-"),
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
              title: <Link to="/support/payout">Payout</Link>,
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
          data={payoutLogData || []}
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

export default PayoutViewLogTable;
