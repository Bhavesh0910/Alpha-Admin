import React, {useEffect, useState} from "react";
import {Button, Card, Breadcrumb} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import exportIcon from "../../../assets/icons/export_now_icon_white.svg";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import "./AffiliateMarketingExportHistory.scss";
import moment from "moment";
import {fetchExportHistory} from "../../../store/NewReducers/affiliateSlice";
import LoaderOverlay from "../../../ReusableComponents/LoaderOverlay";
import dayjs from "dayjs";
import downloadIcon from "../../../assets/icons/download_to_pc.svg";

const AffiliateMarketingExportHistory = () => {
  const [pageSize, setPageSize] = useState(20);
  const [pageNo, setPageNo] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {idToken} = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchExportHistory({idToken, pageNo, pageSize}));
  }, [dispatch, pageNo, pageSize, idToken]);

  const {exportHistoryData, isLoading, error} = useSelector((state) => state.affiliate);
  console.log(exportHistoryData);

  const columns = [
    {
      title: "Created By",
      dataIndex: "created_by",
      key: "created_by",
    },
    {
      title: "Filename",
      dataIndex: "file_name",
      key: "file_name",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => dayjs(text).format("DD/MM/YYYY HH:mm:ss"),
    },
    {
      title: "Download",
      key: "download",
      render: (_, record) =>
        record?.excel_file ? (
          <a
            href={record?.excel_file && record?.excel_file}
            target="_blank"
          >
            <Button
              className="download_btn"
              type="link"
              href={record?.excel_file}
              target="_blank"
              disabled={!record.excel_file}
            >
              Download
              <img
                src={downloadIcon}
                alt=""
              />
            </Button>
          </a>
        ) : (
          "-"
        ),
    },
  ];

  const handlePageChange = (page, updatedPageSize) => {
    setPageNo(page);
    setPageSize(updatedPageSize);
  };

  return (
    <Card className="table-wrapper viewLogs_table aff_export">
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
          data={exportHistoryData?.results || []}
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
