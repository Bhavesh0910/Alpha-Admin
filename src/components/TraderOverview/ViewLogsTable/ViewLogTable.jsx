import React, { useEffect, useState } from "react";
import { Breadcrumb, Card } from "antd";
import { useDispatch, useSelector } from "react-redux";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import LoaderOverlay from "../../../ReusableComponents/LoaderOverlay";
import "./ViewLogTable.scss";
import { logsListReq } from "../../../store/NewReducers/logsSlice";
import { Link, useLocation } from "react-router-dom";

const ViewLogTable = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { idToken } = useSelector((state) => state.auth);
  const { logData, count, isLoading } = useSelector((state) => state.logs);

  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const queryParams = new URLSearchParams(location.search);
  const platform = queryParams.get('platform') || 'MT5'; 
   console.log(platform)

  let displayPlatform;
  switch(platform) {
    case 'trader-accounts':
      displayPlatform = 'MT5';
      break;
    case 'ctrader-accounts':
      displayPlatform = 'CTrader';
      break;
    case 'dxtraders':
      displayPlatform = 'DxTrader';
      break;
    default:
      displayPlatform = 'mt5';
  }
  useEffect(() => {
    const baseurl = `v3/Trader-log/list/`;
    const query = `?platform=${displayPlatform}&page=${pageNo}&page_size=${pageSize}`;
    const url = baseurl + query;
    dispatch(logsListReq({ idToken, url, key: "logData", dispatch }));
  }, [pageNo, pageSize, idToken, platform, dispatch]);

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
      title: "User ID",
      dataIndex: "user_id",
      key: "user_id",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Platform",
      dataIndex: "platform",
      key: "platform",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
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
              title: <Link to="/trader-overview">Trader Overview</Link>,
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
          data={logData || []}
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

export default ViewLogTable;
