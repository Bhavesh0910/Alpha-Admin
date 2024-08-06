import React, { useEffect, useState } from "react";
import { Button, Card, Breadcrumb } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import exportIcon from "../../../assets/icons/export_now_icon_white.svg";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import "./AffiliateMarketingExportHistory.scss";
import moment from "moment";
import { fetchExportHistory } from "../../../store/NewReducers/affiliateSlice";
import LoaderOverlay from "../../../ReusableComponents/LoaderOverlay";

const AffiliateMarketingExportHistory = () => {
  const [pageSize, setPageSize] = useState(20);
  const [pageNo, setPageNo] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { idToken } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchExportHistory({ idToken, pageNo, pageSize }));
  }, [dispatch, pageNo, pageSize, idToken]);

  const { exportHistoryData, isLoading, error } = useSelector((state) => state.affiliate);
  console.log(exportHistoryData)
  const columns = [
    {
      title: "Admin Email ID",
      dataIndex: "created_by",
      key: "created_by",
      render: (text) => text || "N/A",
    },
    {
      title: "File Name",
      dataIndex: "file_name",
      key: "file_name",
      render: (text) => text ? text.split("/").pop() : "N/A",
    },
    {
      title: "Date and Time",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => (
        <div className="date_format">
          <div>{moment(text).format("DD/MM/YYYY")}</div>
          <div>{moment(text).format("HH:mm:ss")}</div>
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (text) => text || "N/A",
    },
    {
      title: "Download",
      dataIndex: "excel_file",
      key: "excel_file",
      render: (url) => (
        <Button href={url} target="_blank" className="export_history_btn">
          Download
          <img src={exportIcon} alt="export_icon" />
        </Button>
      ),
    },
  ];
  

  const handlePageChange = (page, updatedPageSize) => {
    setPageNo(page);
    setPageSize(updatedPageSize);
  };

  return (
    <Card className="table-wrapper viewLogs_table">
      <div className="header_wrapper">
        <h3 className="page_header">Export History</h3>
      </div>
      <div className="breadcrumb_wrapper">
        <Breadcrumb separator=">">
          <Breadcrumb.Item>
            <a href="/affiliate-marketing/">Affiliate List</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Export History</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      {isLoading ? (
        <LoaderOverlay />
      ) : error ? (
        <div className="error_message">Error: {error}</div>
      ) : (
        <AntTable
          columns={columns}
          data={exportHistoryData || []}
          totalPages={Math.ceil(exportHistoryData?.count / pageSize)}
          totalItems={exportHistoryData?.count}
          pageSize={pageSize}
          CurrentPageNo={pageNo}
          setPageSize={setPageSize}
          triggerChange={handlePageChange}
        />
      )}
    </Card>
  );
};

export default AffiliateMarketingExportHistory;
