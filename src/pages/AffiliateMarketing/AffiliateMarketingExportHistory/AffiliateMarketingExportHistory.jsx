import React, {useEffect, useMemo, useState} from "react";
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
  const [pageSize, setPageSize] = useState(10);
  const [pageNo, setPageNo] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {idToken} = useSelector((state) => state.auth);

  useEffect(() => {
    const query = `?page=${pageNo}&page_size=${pageSize}&type=Affiliate Data`;
    const url = `v3/admin/export-history/${query}`;
    dispatch(fetchExportHistory({idToken, url}));
  }, [dispatch, pageNo, pageSize, idToken]);

  const {exportHistoryData, isLoading, error} = useSelector((state) => state.affiliate);
  console.log(exportHistoryData);

  const columns = useMemo(() => [
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
  ]);

  const handlePageChange = (page, updatedPageSize) => {
    setPageNo(page);
    setPageSize(updatedPageSize);
  };

  return (
    <div className="table-wrapper viewLogs_table aff_export">
      <div
        style={{marginBottom: "20px"}}
        className="breadcrumb_wrapper"
      >
        <Breadcrumb separator=">">
          <Breadcrumb.Item>
            <a href="/affiliate-marketing/">Affiliate List</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Export History</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      {isLoading ? (
        <LoaderOverlay />
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
    </div>
  );
};

export default AffiliateMarketingExportHistory;
