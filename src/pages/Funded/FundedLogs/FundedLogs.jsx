import React, { useEffect, useState } from "react";
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
    const baseurl = "v3/funded-log/list/";
    const query = `?page=${pageNo}&page_size=${pageSize}`;
    const url = baseurl + query;
    dispatch(logsListReq({ idToken, url, key: "fundedLogData", dispatch }));
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
      title: "Account No.",
      dataIndex: "account_no",
      key: "account_no",
      width:100,
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Password",
      dataIndex: "password",
      key: "password",
      width:100,
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width:100,
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Raw Spread",
      dataIndex: "raw_spread",
      key: "raw_spread",
      width:100,
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Funding Evaluation",
      dataIndex: "funding_evaluation",
      key: "funding_evaluation",
      width:100,
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Account Balance",
      dataIndex: "account_balance",
      key: "account_balance",
      width:100,
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Stage",
      dataIndex: "stage",
      key: "stage",
      width:100,
      render: (text) => (
        <div className="stage_status_wrapper">
          <p className={text === "funded" ? "funded" : ""}>{text}</p>
        </div>
      ),
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
          data={fundedLogData || []}
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
