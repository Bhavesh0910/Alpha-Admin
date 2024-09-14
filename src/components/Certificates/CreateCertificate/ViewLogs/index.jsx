import React from "react";
import AntTable from "../../../../ReusableComponents/AntTable/AntTable";
import { Link } from "react-router-dom";
import { Breadcrumb } from "antd";
import './style.scss'
const CertificateViewLogTbale = () => {
  const columns = [
    {
      title: "Admin Email ID",
      dataIndex: "email_id",
      key: "email_id",
    },
    {
      title: "Created on",
      dataIndex: "created_on",
      key: "created_on",
    },
    {
      title: "User Email ID",
      dataIndex: "email_id",
      key: "email_id",
    },
    {
      title: "Account No.",
      dataIndex: "account_no",
      key: "account_no",
    },
    {
      title: "Type Of Certificate",
      dataIndex: "certificate_type",
      key: "certificate_type",
    },
    {
      title: "Payout Amount",
      dataIndex: "payout_amt",
      key: "payout_amt",
    },
    {
      title: "Trader Name",
      dataIndex: "trader_name",
      key: "trader_name",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
  ];
  return (
    <div className="viewLogs_table">
      <div className="header_wrapper">
        <Breadcrumb
          separator=">"
          items={[
            {
              title: <Link to="/certificates/create-certificates">Certificates</Link>,
            },
            {
              title: <Link to="#">Log</Link>,
            },
          ]}
        />
      </div>
      <AntTable
      columns={columns}/>
    </div>
  );
};

export default CertificateViewLogTbale;
