import React, {useState, useEffect, useMemo} from "react";
import {Breadcrumb, Button, Card, DatePicker, Spin, Alert} from "antd";
import dayjs from "dayjs";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {fetchExportHistoryReq} from "../../../store/NewReducers/exportHistorySlice";
import "./PaymentExportHistory.scss";
import downloadIcon from "../../../assets/icons/download_to_pc.svg";
import LoaderOverlay from "../../../ReusableComponents/LoaderOverlay";

const {RangePicker} = DatePicker;

const PaymentExportHistory = () => {
  const dispatch = useDispatch();
  const {exportHistoryData, isLoading, isError, errorMessage} = useSelector((state) => state.exportHistory);
  const [dates, setDates] = useState([dayjs().subtract(1, "month"), dayjs()]);
  const {idToken} = useSelector((state) => state.auth);

  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const query = `?page=${pageNo}&page_size=${pageSize}`;
    const url = `v3/admin/export-history/`;
    dispatch(fetchExportHistoryReq({idToken, url, query, dispatch}));
  }, [dispatch, idToken, pageNo]);

  const handleDateChange = (values) => {
    if (values) {
      setDates(values);
    } else {
      setDates(null);
    }
  };

  const columns =useMemo(()=> [
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
          <Button
            className="download_btn"
            type="link"
            href={record?.excel_file}
            target="_blank"
            disabled={!record?.excel_file}
          >
            Download
            <img
              src={downloadIcon}
              alt=""
            />
          </Button>
        ) : (
          "-"
        ),
    },
  ]);

  function triggerChange(page, updatedPageSize) {
    setPageNo(page);
    setPageSize(updatedPageSize);
  }

  return (
    <Card className="table-wrapper viewLogs_table payment_export">
      <div className="header_wrapper">
        <Breadcrumb
          className="breadcrumbs"
          separator=">"
          items={[
            {
              title: <Link to="/payments">Payments</Link>,
            },
            {
              title: <Link to="">Export History</Link>,
            },
          ]}
        />
      </div>
      {/* <div
        style={{ marginBottom: "20px" }}
        className="filter_date_wrapper"
      >
        <RangePicker
          value={dates}
          onChange={handleDateChange}
          format="DD/MM/YYYY"
          className="date-picker"
        />
      </div> */}
      {isLoading ? (
        <LoaderOverlay />
      ) : (
        <AntTable
          columns={columns || []}
          data={exportHistoryData ? exportHistoryData.results : []}
          totalPages={Math.ceil((exportHistoryData?.count || 1) / pageSize)}
          totalItems={exportHistoryData?.count || 0}
          pageSize={pageSize}
          CurrentPageNo={pageNo}
          setPageSize={setPageSize}
          triggerChange={triggerChange}
        />
      )}
    </Card>
  );
};

export default PaymentExportHistory;
