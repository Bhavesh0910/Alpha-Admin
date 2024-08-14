import React from "react";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import downloadIcon from "../../../assets/icons/download_to_pc.svg";
import "./PassRates.scss";
import {Breadcrumb} from "antd";

const ExportHistoryTable = () => {
  const columns = [
    {
      title: "Admin Email ID",
      dataIndex: "adminEmailId",
      key: "adminEmailId",
      render: (text) => text || "-",
    },
    {
      title: "Date and Time",
      dataIndex: "date_time",
      key: "date_time",
      render: (text) => text || "-",
    },
    {
      title: "Export History",
      dataIndex: "export_history",
      key: "export_history",
      render: (text) =>
        (
          <>
            <button className="exportHistory_download_btn">
              <p>Export.xlsx</p>
              <img
                src={downloadIcon}
                alt="downloadIcon"
              />
            </button>
          </>
        ) || "-",
    },
  ];

  const dummyData = [
    {
      key: "1",
      adminEmailId: "tanya.hill@example.com",
      date_time: "02/07/2024 04:07:43",
      export_history: "export",
    },
    {
      key: "1",
      adminEmailId: "tanya.hill@example.com",
      date_time: "02/07/2024 04:07:43",
      export_history: "export",
    },
    {
      key: "1",
      adminEmailId: "tanya.hill@example.com",
      date_time: "02/07/2024 04:07:43",
      export_history: "export",
    },
    {
      key: "1",
      adminEmailId: "tanya.hill@example.com",
      date_time: "02/07/2024 04:07:43",
      export_history: "export",
    },
    {
      key: "1",
      adminEmailId: "tanya.hill@example.com",
      date_time: "02/07/2024 04:07:43",
      export_history: "export",
    },
    {
      key: "1",
      adminEmailId: "tanya.hill@example.com",
      date_time: "02/07/2024 04:07:43",
      export_history: "export",
    },
    {
      key: "1",
      adminEmailId: "tanya.hill@example.com",
      date_time: "02/07/2024 04:07:43",
      export_history: "export",
    },
    {
      key: "1",
      adminEmailId: "tanya.hill@example.com",
      date_time: "02/07/2024 04:07:43",
      export_history: "export",
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
            data={dummyData || []}
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
