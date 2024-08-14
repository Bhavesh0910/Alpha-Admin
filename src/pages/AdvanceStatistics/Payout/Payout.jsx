import React from "react";
import "./Payout.scss";
import ArrowUpGreen from "../../../assets/icons/upArrowGreen.svg";
import exportIcon from "../../../assets/icons/export_btn_icon.svg";
import {Link} from "react-router-dom";
import LoaderOverlay from "../../../ReusableComponents/LoaderOverlay";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";

const Payout = () => {
  const columns = [
    {
      title: "Start Balance",
      dataIndex: "startBalance",
      key: "startBalance",
      render: (text) => text || "-",
    },
    {
      title: "Total Passed",
      dataIndex: "totalPassed",
      key: "totalPassed",
      render: (text) => text || "-",
    },
    {
      title: "Pass Rate",
      dataIndex: "passRate",
      key: "passRate",
      render: (text) => text || "-",
    },
    {
      title: "Total Failed",
      dataIndex: "totalFailed",
      key: "totalFailed",
      render: (text) => text || "-",
    },
    {
      title: "Failed Rate",
      dataIndex: "failedRate",
      key: "failedRate",
      render: (text) => text || "-",
    },
    {
      title: "Passed/Fail Ratio",
      dataIndex: "passedFailRatio",
      key: "passedFailRatio",
      render: (text) => text || "-",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (text) => text || "-",
    },
    {
      title: "Account Active",
      dataIndex: "accountActive",
      key: "accountActive",
      render: (text) => text || "-",
    },
  ];

  const dummyData = [
    {
      key: "1",
      startBalance: "$100000",
      totalPassed: 1121,
      passRate: "78%",
      totalFailed: 312,
      failedRate: "56%",
      passedFailRatio: "6.25%",
      total: "$224525",
      accountActive: "200K",
    },
    {
      key: "2",
      startBalance: "$50000",
      totalPassed: 1121,
      passRate: "78%",
      totalFailed: 312,
      failedRate: "56%",
      passedFailRatio: "6.25%",
      total: "$224525",
      accountActive: "200K",
    },
    {
      key: "3",
      startBalance: "$24200",
      totalPassed: 1121,
      passRate: "78%",
      totalFailed: 312,
      failedRate: "56%",
      passedFailRatio: "6.25%",
      total: "$224525",
      accountActive: "200K",
    },
    {
      key: "4",
      startBalance: "$100000",
      totalPassed: 1121,
      passRate: "78%",
      totalFailed: 312,
      failedRate: "56%",
      passedFailRatio: "6.25%",
      total: "$224525",
      accountActive: "200K",
    },
    {
      key: "5",
      startBalance: "$50000",
      totalPassed: 1121,
      passRate: "78%",
      totalFailed: 312,
      failedRate: "56%",
      passedFailRatio: "6.25%",
      total: "$224525",
      accountActive: "200K",
    },
    {
      key: "6",
      startBalance: "$50000",
      totalPassed: 1121,
      passRate: "78%",
      totalFailed: 312,
      failedRate: "56%",
      passedFailRatio: "6.25%",
      total: "$224525",
      accountActive: "200K",
    },
    {
      key: "7",
      startBalance: "$100000",
      totalPassed: 1121,
      passRate: "78%",
      totalFailed: 312,
      failedRate: "56%",
      passedFailRatio: "6.25%",
      total: "$224525",
      accountActive: "200K",
    },
    {
      key: "8",
      startBalance: "$50000",
      totalPassed: 1121,
      passRate: "78%",
      totalFailed: 312,
      failedRate: "56%",
      passedFailRatio: "6.25%",
      total: "$224525",
      accountActive: "200K",
    },
    {
      key: "9",
      startBalance: "$50000",
      totalPassed: 1121,
      passRate: "78%",
      totalFailed: 312,
      failedRate: "56%",
      passedFailRatio: "6.25%",
      total: "$224525",
      accountActive: "200K",
    },
    {
      key: "10",
      startBalance: "$24200",
      totalPassed: 1121,
      passRate: "78%",
      totalFailed: 312,
      failedRate: "56%",
      passedFailRatio: "6.25%",
      total: "$224525",
      accountActive: "200K",
    },
  ];
  return (
    <>
      <div className="payout_main">
        <div className="payout_header">
          <h2>Payout</h2>
        </div>
        <div className="payout_lower_heading">
          <div className="payout_lower_heading_left">
            <h3>
              Total New Payment Request <span>(Today)</span>
            </h3>
            <div className="payout_lower_heading_inner">
              <h2>25656</h2>
              <button>
                <img
                  src={ArrowUpGreen}
                  alt="ArrowUpGreen"
                />
                <p>5%</p>
              </button>
            </div>
          </div>

          <div className="payout_btn_wrapper">
            <div className="payout_btn">
              <img
                src={exportIcon}
                alt="exportIcon"
              />
              <button>Export</button>
            </div>
            <Link to="/advance-statistics/payout-export-history">
              <p>View Export History</p>
            </Link>
          </div>
        </div>

        <div className="payout_lower_heading_two">
          <div className="left">
            <h3>Eligible Payment List</h3>
          </div>
          <button className="right">Expected Tomorrow</button>
        </div>

        <div>
          {false ? (
            <LoaderOverlay />
          ) : (
            <AntTable
              data={dummyData || []}
              columns={columns}
              // totalPages={Math.ceil(newCodeData?.count / pageSize)}
              // totalItems={newCodeData?.count}
              // pageSize={pageSize}
              // CurrentPageNo={pageNo}
              // setPageSize={setPageSize}
              // triggerChange={triggerChange}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Payout;
