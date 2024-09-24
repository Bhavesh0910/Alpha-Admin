import {Breadcrumb, Card} from "antd";
import React, {useEffect, useMemo, useState} from "react";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {logsListReq} from "../../../store/NewReducers/logsSlice";
import LoaderOverlay from "../../../ReusableComponents/LoaderOverlay";
import {render} from "react-saga";

const CouponLogs = () => {
  const {idToken} = useSelector((state) => state.auth);
  const {couponLogData, count, isLoading} = useSelector((state) => state.logs);

  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const dispatch = useDispatch();

  useEffect(() => {
    const baseurl = "v3/coupon-log/list/";
    const query = `?page=${pageNo}&page_size=${pageSize}&category=COUPON`;
    const url = baseurl + query;
    dispatch(logsListReq({idToken, url, key: "couponLogData", dispatch}));
  }, [pageNo, pageSize, idToken]);

  const columns = useMemo(() => [
    {
      title: "Admin Email ID",
      dataIndex: "admin_email",
      key: "admin_email",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Date and Time",
      dataIndex: "date_time",
      key: "dateTime",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Coupon Code",
      dataIndex: "coupon_code",
      key: "couponCode",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Add User",
      dataIndex: "add_user",
      key: "addUser",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Coupon Amount",
      dataIndex: "coupon_amount",
      key: "couponAmount",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Coupon Percentage",
      dataIndex: "coupon_percentage",
      key: "couponPercentage",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Challenge",
      dataIndex: "challenge",
      key: "challenge",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Coupon Expiry",
      dataIndex: "coupon_expiry",
      key: "couponExpiry",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text) => (text ? text : "-"),
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
              title: <Link to="/coupon">Coupon</Link>,
            },
            {
              title: <Link to="">Log</Link>,
            },
          ]}
        />
      </div>
      {isLoading ? (
        <LoaderOverlay />
      ) : (
        <AntTable
          columns={columns}
          data={couponLogData || []}
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

export default CouponLogs;
