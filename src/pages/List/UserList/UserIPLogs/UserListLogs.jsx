import React, { useEffect, useState } from "react";
import { Breadcrumb, Card } from "antd";
import { useDispatch, useSelector } from "react-redux";
import AntTable from "../../../../ReusableComponents/AntTable/AntTable";
import LoaderOverlay from "../../../../ReusableComponents/LoaderOverlay";
import "./UserListLogs.scss"; 
import { logsListReq } from "../../../../store/NewReducers/logsSlice";

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

  const columns = [
    {
      title: "Admin Email ID",
      dataIndex: "adminEmailId",
      key: "adminEmailId",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Date and Time",
      dataIndex: "dateTime",
      key: "dateTime",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Enter Email",
      dataIndex: "enterEmail",
      key: "enterEmail",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Affiliate Code",
      dataIndex: "affiliateCode",
      key: "affiliateCode",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Commission",
      dataIndex: "commission",
      key: "commission",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Repeat Commission",
      dataIndex: "repeatCommission",
      key: "repeatCommission",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
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
          data={userLogData || []}
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

export default UserListLogs;
