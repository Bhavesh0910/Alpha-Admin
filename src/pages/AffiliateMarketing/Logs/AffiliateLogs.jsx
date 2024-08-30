import React, {useEffect, useState} from "react";
import {Breadcrumb, Card} from "antd";
import {useDispatch, useSelector} from "react-redux";
import moment from "moment";
import LoaderOverlay from "../../../ReusableComponents/LoaderOverlay";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import {logsListReq} from "../../../store/NewReducers/logsSlice";
import {Link} from "react-router-dom";
import "./AffiliateLogs.scss";

const AffiliateLogs = () => {
  const {idToken} = useSelector((state) => state.auth);
  const {affiliateLogData, count, isLoading, isError} = useSelector((state) => state.logs);

  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const dispatch = useDispatch();

  useEffect(() => {
    const baseUrl = "v3/affiliate-log/list/";
    const query = `?page=${pageNo}&page_size=${pageSize}`;
    const url = baseUrl + query;
    if (idToken) {
      dispatch(logsListReq({idToken, url, key: "affiliateLogData", dispatch}));
    }
  }, [pageNo, pageSize, idToken, dispatch]);

  const columns = [
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
      render: (text) =>
        text ? (
          <div className="date_format">
            <div>{moment(text).format("DD/MM/YYYY")}</div>
            <div>{moment(text).format("hh:mm:ss")}</div>
          </div>
        ) : (
          "-"
        ),
    },
    {
      title: "User Email",
      dataIndex: "user_email",
      key: "user_email",
      render: (text) => text || "-",
    },
    {
      title: "Affiliate Code",
      dataIndex: "affiliate_code",
      key: "affiliate_code",
      render: (text) => text || "-",
    },
    {
      title: "Commission",
      dataIndex: "commission",
      key: "commission",
      render: (text) => text || "-",
    },
    {
      title: "Repeat Commission",
      dataIndex: "repeat_commission",
      key: "repeat_commission",
      render: (text) => text || "-",
    },
  ];

  function triggerChange(page, updatedPageSize) {
    setPageNo(page);
    setPageSize(updatedPageSize);
  }

  return (
    <Card className="table-wrapper viewLogs_table">
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
          data={affiliateLogData || []}
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

export default AffiliateLogs;
