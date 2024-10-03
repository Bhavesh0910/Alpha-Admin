import React, { useEffect, useMemo, useState } from "react";
import { Breadcrumb } from "antd";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import LoaderOverlay from "../../../ReusableComponents/LoaderOverlay";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import { logsListReq } from "../../../store/NewReducers/logsSlice";
import { Link } from "react-router-dom";
import "./AffiliateLogs.scss";

const AffiliateLogs = () => {
  const { idToken } = useSelector((state) => state.auth);
  const { affiliateLogData, count, isLoading } = useSelector((state) => state.logs);

  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const dispatch = useDispatch();

  useEffect(() => {
    const query = `?page=${pageNo}&page_size=${pageSize}&category=AFFILIATE`;
    if (idToken) {
      dispatch(logsListReq({ idToken, url: query, key: "affiliateLogData", dispatch }));
    }
  }, [pageNo, pageSize, idToken, dispatch]);

  const transformedData = (affiliateLogData || []).map((log) => ({
    admin_email: log.admin_user?.email || "-",
    date_time: log.created_at ? moment(log.created_at).format('YYYY-MM-DD HH:mm:ss') : "-",
    user_email: log.user_reference || "-",
    category: log.category || "-",
    action: log.action || "-",
    account_reference: log.account_reference || "-",
    admin_comment: log.admin_comment || "-",
  }));

  const columns = useMemo(() => [
    {
      title: "Admin Email ID",
      dataIndex: "admin_email",
      key: "admin_email",
      render: (text) => text || "-",
    },
    {
      title: "Created at",
      dataIndex: "date_time",
      key: "date_time",
      render: (text) => text || "-",
    },
    {
      title: "User reference",
      dataIndex: "user_email",
      key: "user_email",
      render: (text) => text || "-",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (text) => text || "-",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text) => text || "-",
    },
    {
      title: "Account Reference",
      dataIndex: "account_reference",
      key: "account_reference",
      render: (text) => text || "-",
      width: 100
    },
    {
      title: "Admin Comment",
      dataIndex: "admin_comment",
      key: "admin_comment",
      render: (text) => text || "-",
    },
  ], []);

  function triggerChange(page, updatedPageSize) {
    setPageNo(page);
    setPageSize(updatedPageSize);
  }

  return (
    <div className="table-wrapper viewLogs_table">
      <div className="header_wrapper">
        <Breadcrumb separator=">">
          <Breadcrumb.Item>
            <Link to="/affiliate-marketing">Affiliate List</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Affiliate logs</Breadcrumb.Item>
        </Breadcrumb>
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

export default AffiliateLogs;
