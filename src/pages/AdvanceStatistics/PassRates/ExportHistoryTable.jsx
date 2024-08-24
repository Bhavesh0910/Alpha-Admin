import React, {useEffect, useState} from "react";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import downloadIcon from "../../../assets/icons/download_to_pc.svg";
import "./PassRates.scss";
import {Breadcrumb} from "antd";
import {useDispatch, useSelector} from "react-redux";
import dayjs from "dayjs";
import {fetchExportHistoryReq} from "../../../store/NewReducers/exportHistorySlice";
import {Link} from "react-router-dom";

const ExportHistoryTable = () => {
  const dispatch = useDispatch();
  const {exportLink, exportHistoryData} = useSelector((state) => state.exportHistory);
  const [dates, setDates] = useState([dayjs().subtract(1, "month"), dayjs()]);
  const {idToken} = useSelector((state) => state.auth);

  useEffect(() => {
    const startDate = dates[0]?.format("DD/MMM/YYYY").toLowerCase(); // Adjusted format to abbreviated month in lowercase
    const endDate = dates[1]?.format("DD/MMM/YYYY").toLowerCase(); // Adjusted format to abbreviated month in lowercase

    const url = "pass-rate-export/history/";

    if (startDate && endDate) {
      const query = `?start_date=${startDate}&end_date=${endDate}`;
      dispatch(fetchExportHistoryReq({idToken, url}));
    }
  }, [dates, dispatch, idToken]);

  const handleDateChange = (values) => {
    if (values) {
      setDates(values);
    }
  };

  const columns = [
    {
      title: "S3 File Url",
      dataIndex: "s3_file_url",
      key: "s3_file_url",
      render: (text) => text || "-",
    },
    {
      title: "Filename",
      dataIndex: "filename",
      key: "filename",
      render: (text) => text || "-",
    },
    {
      title: "Export History",
      dataIndex: "export_history",
      key: "export_history",
      render: (text, record) =>
        (
          <>
            <Link to={record?.s3_file_url}>
              <button className="exportHistory_download_btn">
                <p>Export.xlsx</p>
                <img
                  src={downloadIcon}
                  alt="downloadIcon"
                />
              </button>
            </Link>
          </>
        ) || "-",
    },
  ];

  return (
    <>
      <div className="exportHistoryTable_main">
        <div>
          <Breadcrumb
            separator=">"
            items={[
              {
                title: <a href="/advance-statistics/pass-rates">Pass Rates</a>,
              },
              {
                title: <a href="">Export History</a>,
              },
            ]}
          />
        </div>
        <div>
          <AntTable
            data={[exportHistoryData] || []}
            columns={columns}
            // totalPages={Math.ceil(newCodeData?.count / pageSize)}
            // totalItems={newCodeData?.count}
            //   pageSize={pageSize}
            //   CurrentPageNo={pageNo}
            //   setPageSize={setPageSize}
            //   triggerChange={triggerChange}
          />
        </div>
      </div>
    </>
  );
};

export default ExportHistoryTable;
