import React, {useState} from "react";
import AntTable from "../../ReusableComponents/AntTable/AntTable";
import {DatePicker, Button, Select, Dropdown, Menu, Modal, Form, Input} from "antd";
import {useNavigate} from "react-router-dom";
import searchIcon from "../../assets/icons/searchIcon.svg";
import comment from "../../assets/icons/comment.svg";
import "./Funded.scss";
import {DownOutlined} from "@ant-design/icons";
const {Option} = Select;
const {RangePicker} = DatePicker;
const Funded = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [category, setCategory] = useState("all");
  const [isExpandable, setIsExpandable] = useState(true);
  const [editComment, setEditComment] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalAction, setModalAction] = useState("");

  const handleStatusChange = (index, status) => {
    // const newData = [...data];
    // newData[index].status = status;
    // setData(newData);
  };

  const statusMenu = (key) => (
    <Menu onClick={(e) => handleStatusChange(key, e.key)}>
      <Menu.Item key="New">New</Menu.Item>
      <Menu.Item key="Approved">Approved</Menu.Item>
      <Menu.Item key="In Progress">In Progress</Menu.Item>
      <Menu.Item key="Rejected">Rejected</Menu.Item>
    </Menu>
  );
  const highlightText = (text, search) => {
    if (!search) return text;
    const regex = new RegExp(`(${search})`, "gi");
    const parts = String(text)?.split(regex);
    return (
      <>
        {parts.map((part, index) =>
          regex.test(part) ? (
            <span
              key={index}
              className="highlight"
            >
              {part}
            </span>
          ) : (
            part
          ),
        )}
      </>
    );
  };

  const openEditModal = (comment, index) => {
    setEditComment(comment);
    setEditIndex(index);
    setIsModalVisible(true);
  };

  const handleEditComment = () => {
    // const newData = [...data];
    // newData[editIndex].comment = editComment;
    // setData(newData);
    setIsModalVisible(false);
  };

  const columns = [];

  const dummyData = [
    {
      key: "1",
      flag: "",
      email: "example@example.com",
      accountNumber: "14287523145511",
      maxLoss: "$45.04",
      dailyLoss: "$15.14",
      profit: "$687.12",
      balance: "$1047.19",
      comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do",
      status: "new",
      phase1Id: "124262521",
      fundedId: "-",
      details: "Account Metrics",
    },
  ];

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
  };

  const openActionModal = (action, index) => {
    setEditIndex(index);
    setIsModalVisible(true);
    setModalAction(action);
  };

  const handleAction = () => {
    // const newData = [...data];
    // if (modalAction === "Accept") {
    //   newData[editIndex].status = "Approved";
    // } else if (modalAction === "Reject") {
    //   newData[editIndex].status = "Rejected";
    // }
    // setData(newData);
    setIsModalVisible(false);
  };

  return (
    <div className="funded_wrapper">
      <div className="header_wrapper">
        <h3>Funded</h3>
        <Button
          onClick={() => navigate("/funded/funded-view-logs")}
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
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <div className="searchImg">
            <img
              src={searchIcon}
              alt="searchIcon"
            />
          </div>
        </div>
        <div className="filter_buttons">
          <Button
            className={activeTab === "all" ? "active" : ""}
            onClick={() => handleTabChange("all")}
          >
            All
          </Button>
          <Button
            className={activeTab === "new" ? "active" : ""}
            onClick={() => handleTabChange("new")}
          >
            New
          </Button>
          <Button
            className={activeTab === "approved" ? "active" : ""}
            onClick={() => handleTabChange("approved")}
          >
            Approved
          </Button>
          <Button
            className={activeTab === "rejected" ? "active" : ""}
            onClick={() => handleTabChange("rejected")}
          >
            Rejected
          </Button>
          <Button
            className={activeTab === "in progress" ? "active" : ""}
            onClick={() => handleTabChange("in progress")}
          >
            In Progress
          </Button>
        </div>
        <RangePicker />
      </div>
      <AntTable
        isExpandable={isExpandable}
        data={dummyData}
        columns={columns}
      />
      <Modal
        title={modalAction}
        onCancel={() => setIsModalVisible(false)}
        onOk={modalAction === "Edit" ? handleEditComment : handleAction}
      >
        {modalAction === "Edit" ? (
          <Form.Item label="Edit Comment">
            <Input.TextArea
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
            />
          </Form.Item>
        ) : (
          <Form.Item label="Write your reason">
            <Input.TextArea />
          </Form.Item>
        )}
      </Modal>
    </div>
  );
};

export default Funded;
