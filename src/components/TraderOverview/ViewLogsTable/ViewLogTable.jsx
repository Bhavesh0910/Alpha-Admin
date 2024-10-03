import React, { useEffect, useMemo, useState } from "react";
import { Breadcrumb, Radio } from "antd";
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
  const [activePlatform, setActivePlatform] = useState("MT5_ACCOUNT");

  useEffect(() => {
    const query = `?category=${activePlatform}&page=${pageNo}&page_size=${pageSize}`;
    dispatch(logsListReq({ idToken, url: query, key: "logData", dispatch }));
  }, [pageNo, pageSize, idToken, activePlatform, dispatch]);

  const columns = useMemo(() => [
    {
      title: "Admin Email ID",
      dataIndex: ["admin_user", "email"],
      key: "admin_email",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Date and Time",
      dataIndex: "created_at",
      key: "date_time",
      render: (text) => (text ? new Date(text).toLocaleString() : "-"), // Formatting date
    },
    {
      title: "User Reference",
      dataIndex: "user_reference",
      key: "user_id",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Platform",
      dataIndex: "category",
      key: "platform",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Admin Comment",
      dataIndex: "admin_comment",
      key: "description",
      render: (text) => (text ? text : "-"),
    },
  ]);

  function triggerChange(page, updatedPageSize) {
    setPageNo(page);
    setPageSize(updatedPageSize);
  }

  const handlePlatformChange = (e) => {
    setActivePlatform(e.target.value);
    setPageNo(1); // Reset to the first page when changing the platform
  };

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
        <Radio.Group value={activePlatform} onChange={handlePlatformChange}>
          <Radio.Button value="MT5_ACCOUNT">MT5</Radio.Button>
          <Radio.Button value="CTRADER_ACCOUNT">CTrader</Radio.Button>
          <Radio.Button value="DXTRADE_ACCOUNT">Dx</Radio.Button>
        </Radio.Group>
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
