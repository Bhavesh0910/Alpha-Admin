import React, {useState, useEffect} from "react";
import {Breadcrumb, Button, Card, DatePicker} from "antd";
import dayjs from "dayjs";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import {Link} from "react-router-dom";
import exportIcon from "../../../assets/icons/export_now_icon_white.svg";
import {paymentExportsReq} from "../../../store/NewReducers/payment"; // Adjust import path as necessary
import {useDispatch, useSelector} from "react-redux";
import "./WithdrawalDetailsExport.scss";

const {RangePicker} = DatePicker;

const WithdrawalDetailsExportHistory = () => {
  const dispatch = useDispatch();
  const {exportLink, exportHistoryData} = useSelector((state) => state.payment);
  const [dates, setDates] = useState([dayjs().subtract(1, "month"), dayjs()]);
  const {idToken} = useSelector((state) => state.auth);

  useEffect(() => {
    const startDate = dates[0]?.format("DD/MMM/YYYY").toLowerCase(); // Adjusted format to abbreviated month in lowercase
    const endDate = dates[1]?.format("DD/MMM/YYYY").toLowerCase(); // Adjusted format to abbreviated month in lowercase

    if (startDate && endDate) {
      const query = `?start_date=${startDate}&end_date=${endDate}`;
      dispatch(paymentExportsReq({idToken, query}));
    }
  }, [dates, dispatch, idToken]);

  const handleDateChange = (values) => {
    if (values) {
      setDates(values);
    }
  };

  useEffect(() => {
    // if (exportLink) {
    //   window.open(exportLink, "_blank");
    // }
  }, [exportLink]);

  const columns = [
    {
      title: "Filename",
      dataIndex: "filename",
      key: "filename",
    },
    {
      title: "Download",
      key: "download",
      render: (_, record) => (
        <Button
          className="download_btn"
          type="link"
          href={record.s3_file_url}
          target="_blank"
        >
          Download
        </Button>
      ),
    },
  ];

  // Example data
  const exampleData = [
    {
      key: "1",
      adminEmail: "admin@example.com",
      dateTime: "2024-06-30 14:30:00",
    },
    {
      key: "2",
      adminEmail: "admin@example.com",
      dateTime: "2024-06-30 15:00:00",
    },
  ];

  return (
    <Card className="table-wrapper viewLogs_table payment_export">
      <div className="header_wrapper">
        <Breadcrumb
          separator=">"
          items={[
            {
              title: <Link to="/advance-statistics/withdrawal-status">Withdrawal Status</Link>,
            },
            {
              title: <Link to="">Export History</Link>,
            },
          ]}
        />
      </div>

      <AntTable
        columns={columns}
        data={[exportHistoryData]}
      />
    </Card>
  );
};

export default WithdrawalDetailsExportHistory;
