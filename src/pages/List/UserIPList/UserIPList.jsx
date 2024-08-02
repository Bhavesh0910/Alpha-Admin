import { Button, message, Select, Tooltip } from "antd";
import './UserIPList.scss';
import React, { useEffect, useState } from "react";
import searchIcon from "../../../assets/icons/searchIcon.svg";
import { useNavigate } from "react-router-dom";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchIpLogs } from "../../../store/NewReducers/listSlice";
import { CopyOutlined } from "@ant-design/icons";
import LoaderOverlay from "../../../ReusableComponents/LoaderOverlay";

const { Option } = Select;

const UserIPList = () => {
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("allowed");
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
          {text || '-'}
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
      render: (text) => text || '-',
    },
    {
      title: "IP",
      dataIndex: "ip",
      key: "ip",
      render: (text) => text || '-',
    },
    {
      title: "Region",
      dataIndex: "region",
      key: "region",
      render: (text) => text || '-',
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (text ? "Blocked" : 'Allowed') || '-',
    },
  ];

  return (
    <div className="list_container">
      <div className="header_wrapper">
        <h3 className="page_header">IP List</h3>
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
      </div>
      {isLoading && <LoaderOverlay />}
      <AntTable
        data={ipLogsData}
        columns={columns}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default UserIPList;
