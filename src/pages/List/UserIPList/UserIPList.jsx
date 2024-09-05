import {Button, message, Modal, Select, Tooltip} from "antd";
import "./UserIPList.scss";
import React, {useEffect, useMemo, useState} from "react";
import searchIcon from "../../../assets/icons/searchIcon.svg";
import {useNavigate} from "react-router-dom";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import {useDispatch, useSelector} from "react-redux";
import {blockOrUnblockIp, fetchIpLogs} from "../../../store/NewReducers/listSlice";
import {CopyOutlined} from "@ant-design/icons";
import LoaderOverlay from "../../../ReusableComponents/LoaderOverlay";
import blockIcon from "../../../assets/icons/block.svg";
import unblockIcon from "../../../assets/icons/unblock.svg";
import {returnMessages} from "../../../store/reducers/message";

const {Option} = Select;

const UserIPList = () => {
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("allowed");
  const [category, setCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const {idToken} = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [action, setAction] = useState(null);
  const [reason, setReason] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);

  const {ipLogsData, isLoading, isBlockLoading, error} = useSelector((state) => state.list);

  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetch = () => {
    dispatch(fetchIpLogs({idToken, search: searchText, blocked: activeTab === "blocked" ? "True" : "False", currentPage}));
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

  const handleAction = (action, record) => {
    setAction(action);
    setSelectedRecord(record);
    setIsModalVisible(true);
  };

  const handleBlock = async () => {
    if (selectedRecord && reason) {
      try {
        dispatch(
          blockOrUnblockIp({
            user_email: selectedRecord.user,
            reason,
            idToken,
            block: action === "Block",
          }),
        ).unwrap();
        dispatch(returnMessages(`${action ? "Blocked" : "Unblocked"} Successfully`, 200));
        setIsModalVisible(false);
        dispatch(fetchIpLogs({idToken, search: "", blocked: activeTab === "blocked" ? "True" : "False", currentPage}));
      } catch (error) {}
    } else {
      message.error("Please provide a reason");
    }
    setIsModalVisible(false);
  };

  console.log(isBlockLoading);

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = useMemo(() => [
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      width: 100,
      render: (text) => (
        <div style={{display: "flex", alignItems: "center"}}>
          {text || "-"}
          <Tooltip title="Copy">
            <CopyOutlined
              style={{marginLeft: 8, cursor: "pointer", color: "#04d9ff"}}
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
      width: 100,
      render: (text) => text || "-",
    },
    {
      title: "IP",
      dataIndex: "ip",
      key: "ip",
      width: 100,
      render: (text) => text || "-",
    },
    {
      title: "Region",
      dataIndex: "region",
      key: "region",
      width: 100,
      render: (text) => text || "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (text) => (text ? "Blocked" : "Allowed") || "-",
    },
    {
      title: "Action",
      dataIndex: "actions",
      width: 100,
      render: (_, record) => (
        <div className="action_wrapper">
          {record.blocked ? (
            <div
              title="Unblock"
              className=""
              onClick={() => handleAction("Unblock", record)}
            >
              <img
                src={unblockIcon}
                alt=""
              />
            </div>
          ) : (
            <div
              title="Block"
              className=""
              onClick={() => handleAction("Block", record)}
            >
              <img
                src={blockIcon}
                alt=""
              />
            </div>
          )}
        </div>
      ),
    },
  ]);

  function triggerChange(page, updatedPageSize) {
    setPageNo(page);
    setPageSize(updatedPageSize);
  }

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
          {/* <Select
            className="category_dropdown"
            defaultValue="all"
            onChange={handleCategoryChange}
          >
            <Option value="all">All Categories</Option>
            <Option value="swift">Swift</Option>
            <Option value="wire">Wire</Option>
          </Select> */}
          <input
            placeholder="Search..."
            className="search_input"
            onKeyDown={(e) => handleSearch(e)}
          />
          <div className="searchImg">
            <img
              src={searchIcon}
              alt="searchIcon"
            />
          </div>
        </div>
      </div>
      {isLoading && <LoaderOverlay />}
      <AntTable
        data={ipLogsData?.results}
        columns={columns}
        totalPages={Math.ceil(ipLogsData?.count / pageSize)}
        totalItems={ipLogsData?.count}
        pageSize={pageSize}
        CurrentPageNo={pageNo}
        setPageSize={setPageSize}
        triggerChange={triggerChange}
        scrollY={400}
      />

      <Modal
        title={`${action} Account`}
        visible={isModalVisible}
        onCancel={handleCancel}
        centered
        className="table-modal"
        footer={[
          <div
            className="modal-btns-wrapper"
            key="footer"
          >
            <Button
              className="cancel-btn"
              key="cancel"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              className="standard_button block_btn"
              key="block"
              type="primary"
              danger
              onClick={handleBlock}
            >
              {action}
            </Button>
          </div>,
        ]}
      >
        <div className="modal-content">
          <p className="modal-title">Write Your Reason</p>
          <textarea
            onChange={(e) => {
              setReason(e.target.value);
            }}
            placeholder="Write your reason here.."
          ></textarea>
        </div>
      </Modal>
    </div>
  );
};

export default UserIPList;
