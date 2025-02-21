import { Breadcrumb } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logsListReq } from "../../../store/NewReducers/logsSlice";
import LoaderOverlay from "../../../ReusableComponents/LoaderOverlay";
import moment from "moment";

const RequestPayout = () => {
  const { idToken } = useSelector((state) => state.auth);
  const { reqPayoutLogData, count, isLoading } = useSelector((state) => state.logs);

  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const dispatch = useDispatch();

  useEffect(() => {
    const query = `?page=${pageNo}&page_size=${pageSize}&category=PAYOUT&action=PAYOUT_REQUEST`;
    dispatch(logsListReq({ idToken, url: query, key: "reqPayoutLogData", dispatch }));
  }, [pageNo, pageSize, idToken, dispatch]);

  const transformedData = (reqPayoutLogData || []).map((log) => ({
    admin_email: log.admin_user?.email || "-",
    date_time: log.created_at ? moment(log.created_at).format('YYYY-MM-DD HH:mm:ss') : "-",
    login_id: log.meta_data?.login_id || "-",
    user_reference: log.user_reference || "-",
    amount: log.meta_data?.amount || "-",
    reason: log.meta_data?.reason || "-",
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
      render: (text) => text || "-",
    },
    {
      title: "Login ID", 
      dataIndex: "login_id",
      key: "login_id",
      render: (text) => text || "-",
    },
    {
      title: "User Reference",
      dataIndex: "user_reference",
      key: "user_reference",
      render: (text) => text || "-",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text) => text || "-",
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      render: (text) => text || "-",
      width:200
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
            <Link to="/payout">Request Payout</Link>
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

export default RequestPayout;
