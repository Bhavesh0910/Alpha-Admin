import React from "react";
import searchIcon from "../../../assets/icons/searchIcon.svg";
import {DatePicker, Select} from "antd";
import "./style.scss";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";

function AllCertificates() {
  const columns = [
    {
      title: "Username",
      dataIndex: "user_name",
      key: "user_name",
    },
    {
      title: "Log ID",
      dataIndex: "logId",
      key: "logId",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Created at",
      dataIndex: "created_at",
      key: "created_at",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Certificate",
      dataIndex: "certificate",
      key: "certificate",
    },
  ];
  return (
    <div className="all-certificates-wrapper">
      <div className="table_header_filter">
        <div className="search_box_wrapper">
          {/* <Select
          placeholder='Select Category'
          ></Select> */}
          <input placeholder="Search by category wise" />
          <div className="searchImg">
            <img
              src={searchIcon}
              alt="searchIcon"
            />
          </div>
        </div>
        <div className="date">
          <DatePicker />
        </div>
      </div>
      <AntTable columns={columns} />
    </div>
  );
}

export default AllCertificates;
