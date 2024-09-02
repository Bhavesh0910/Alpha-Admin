import React, { useEffect, useState } from "react";
import { Breadcrumb, Card } from "antd";
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
    const baseurl = "v3/payout-request-log/list/";
    const query = `?page=${pageNo}&page_size=${pageSize}`;
    const url = baseurl + query;
    dispatch(logsListReq({ idToken, url, key: "payoutLogData", dispatch }));
  }, [pageNo, pageSize, idToken, dispatch]);

  const columns = [
    {
      title: "Admin Email ID",
      dataIndex: "admin_email",
      key: "admin_email",
      width:100,
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Date and Time",
      dataIndex: "date_time",
      key: "date_time",
      width:100,
      render: (text) => (text ? text : "-"),
    },
    {
      title: "User ID",
      dataIndex: "user_id",
      key: "user_id",
      width:100,
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
      width:100,
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
              title: <Link to="/support/payout/">Payout</Link>,
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
    </Card>
  );
};

export default PayoutViewLogTable;
