import { Button, message, Radio, Select, Tooltip } from "antd";
import './UserIPList.scss'
import React, { useEffect, useState } from "react";
import searchIcon from "../../../assets/icons/searchIcon.svg";
import { useNavigate } from "react-router-dom";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import { returnErrors } from "../../../store/reducers/error";
import { useDispatch, useSelector } from "react-redux";
import { fetchIpLogs } from "../../../store/NewReducers/listSlice";
import { CopyOutlined } from "@ant-design/icons";
import CopyToClipboard from "react-copy-to-clipboard";
import LoaderOverlay from "../../../ReusableComponents/LoaderOverlay";


const { Option } = Select;

const UserIPList = () => {
  const [searchText, setSearchText] = useState("");
  const [
    activeTab, setActiveTab] = useState("allowed");
  const [category, setCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const { idToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const { ipLogsData, isLoading, error } = useSelector((state) => state.list);

  const fetch = () => {
    dispatch(fetchIpLogs({ idToken, search: searchText, blocked: activeTab === "blocked" ? 'True' : 'False', currentPage }));
  };

  useEffect(() => {
    if (idToken) {
      fetch();
    }
  }, [idToken, currentPage, searchText, activeTab]);

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      console.log(searchText, e.key)
      setSearchText(e.target.value);
    }
  };


  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
  };

  const columns = [
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      render: (text) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {text}
          <Tooltip title="Copy">
            <CopyOutlined
              style={{ marginLeft: 8, cursor: 'pointer', color: '#75ebc3' }}
              onClick={() => message.success("Copied email")}
            />
          </Tooltip>
        </div>
      ),
    },
    {
      title: "Date Created",
      dataIndex: "created",
      key: "created",
    },
    {
      title: "IP",
      dataIndex: "ip",
      key: "ip",
    },
    {
      title: "Region",
      dataIndex: "region",
      key: "region",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <>
          {text ? "Blocked" : 'Allowed'}
        </>
      )
    },
  ];


  return (
    <div className="list_container">
      <div className="header_wrapper">
      <h3 className="page_header">Ip List</h3>
      <Button
          onClick={() => navigate("user-ip-logs")}
          className="view_logs__btn standard_button"
        >
          View Logs
        </Button>
        </div>
        <div className="table_header_filter">
          <div className="search_box_wrapper">
            <Select
              className="category_dropdown"
              defaultValue="all"
              onChange={handleCategoryChange}
            >
              <Option value="all">All Categories</Option>
              <Option value="swift">Swift</Option>
              <Option value="wire">Wire</Option>
            </Select>
            <input
              placeholder="Search..."
              className="search_input"
              onKeyDown={(e) => handleSearch(e)}
            />
            <div className="searchImg">
              <img src={searchIcon} alt="searchIcon" />
            </div>
          </div>

{/* 
          <Radio.Group value={activeTab} onChange={(e) => setActiveTab(e.target.value)}>
            <Radio.Button value="allowed">Allowed</Radio.Button>
            <Radio.Button value="blocked">Blocked</Radio.Button>
          </Radio.Group> */}
        </div>
        {isLoading && <LoaderOverlay />}
        <AntTable data={ipLogsData} columns={columns} />
      </div>
      );
};

      export default UserIPList;
