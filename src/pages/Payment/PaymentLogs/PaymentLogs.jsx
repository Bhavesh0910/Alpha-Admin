import React, { useEffect, useMemo, useState } from "react";
import { Breadcrumb, Card } from "antd";
import { useDispatch, useSelector } from "react-redux";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import LoaderOverlay from "../../../ReusableComponents/LoaderOverlay";
import "./PaymentLogs.scss";
import moment from "moment";
import { logsListReq } from "../../../store/NewReducers/logsSlice";
import { Link } from "react-router-dom";

const PaymentLogs = () => {
  const { idToken } = useSelector((state) => state.auth);
  const { paymentLogData, count, isLoading, isError } = useSelector((state) => state.logs);

  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const dispatch = useDispatch();

  useEffect(() => {
    const query = `?page=${pageNo}&page_size=${pageSize}&category=PAYMENT`;
    const url = query;
    if (idToken) {
      dispatch(logsListReq({ idToken, url, key: "paymentLogData", dispatch }));
    }
  }, [pageNo, pageSize, idToken, dispatch]);

  // Transform data to fit table columns
  const transformedData = useMemo(() => {
    return paymentLogData.map(log => ({
      adminEmail: log.admin_user.email,
      dateTime: log.created_at,
      userID: log.user_reference,
      status: log.meta_data.payment_status,
    }));
  }, [paymentLogData]);

  const columns = useMemo(() => [
    {
      title: "Admin Email ID",
      dataIndex: "adminEmail",
      key: "adminEmail",
    },
    {
      title: "Created at",
      dataIndex: "dateTime",
      key: "dateTime",
      render: (text) => (
        <div className="date_format">
          <div>{moment(text).format("DD/MM/YYYY")}</div>
          <div>{moment(text).format("hh:mm:ss")}</div>
        </div>
      ),
    },
    {
      title: "User ID",
      dataIndex: "userID",
      key: "userID",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <div className="status_btn_wrapper">
          <div className={text === "Refunded" ? "refunded" : ""}>
            {text}
          </div>
        </div>
      ),
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
              title: <Link to="/payments">Payments</Link>,
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

export default PaymentLogs;
