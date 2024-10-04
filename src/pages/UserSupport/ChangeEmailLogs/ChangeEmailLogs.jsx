import React, { useEffect, useMemo, useState } from "react";
import { Breadcrumb } from "antd";
import { useDispatch, useSelector } from "react-redux";
import LoaderOverlay from "../../../ReusableComponents/LoaderOverlay";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import moment from "moment";
import { logsListReq } from "../../../store/NewReducers/logsSlice";
import dayjs from "dayjs";

const ChangeEmailLogs = () => {
  const { idToken } = useSelector((state) => state.auth);
  const { changeEmailLogData, count, isLoading } = useSelector((state) => state.logs);

  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const dispatch = useDispatch();

  useEffect(() => {
    const query = `?page=${pageNo}&page_size=${pageSize}&category=USER&action=USER_EMAIL_CHANGE`;
    if (idToken) {
      dispatch(logsListReq({ idToken, url: query, key: "changeEmailLogData", dispatch }));
    }
  }, [pageNo, pageSize, idToken, dispatch]);

  
  // Transform the log data
  const transformedData = (changeEmailLogData || []).map((log) => ({
    admin_email: log.admin_user?.email || "-",
    date_time: log.created_at ? moment(log.created_at).format('YYYY-MM-DD HH:mm:ss') : "-",
    current_email: log.meta_data?.cur_email?.[0] || "-", // Accessing the first element of cur_email
    new_email: log.meta_data?.new_email?.[0] || "-", // Accessing the first element of new_email
    user_reference: log.user_reference || "-",
    category: log.category || "-",
    action: log.action || "-",
    account_reference: log.account_reference || "-", // This might be null in the provided data
  }));

  const columns = useMemo(() => [
    {
      title: "Admin Email ID",
      dataIndex: "admin_email",
      key: "admin_email",
      render: (text) => text || "-",
    },
    {
      title: "Date and Time",
      dataIndex: "date_time",
      key: "date_time",
      render: (text) => (
        text ? dayjs(text).format("DD/MMM/YYYY") : "-"
      ),
    },
    {
      title: "Current Email",
      dataIndex: "current_email",
      key: "current_email",
      render: (text) => text || "-",
    },
    {
      title: "New Email",
      dataIndex: "new_email",
      key: "new_email",
      render: (text) => text || "-",
    },
    {
      title: "User Reference",
      dataIndex: "user_reference",
      key: "user_reference",
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
            <a href="/user-support">Change Email</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Log</Breadcrumb.Item>
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

export default ChangeEmailLogs;
