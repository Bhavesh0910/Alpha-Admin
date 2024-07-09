import React, {useEffect, useState} from "react";
import "./UserList.scss";
import {Table, Input, Select, Button, Modal, Tooltip, message, Dropdown, Menu, Radio} from "antd";
import moment from "moment";
import {CopyOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import {deleteUser, getUserList, changeUserStatus, resetPassword} from "../../../utils/api/apis";
import CopyToClipboard from "react-copy-to-clipboard";
import axios from "axios";
import {returnErrors} from "../../../store/reducers/error";
import {returnMessages} from "../../../store/reducers/message";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import {fetchUserList} from "../../../store/NewReducers/listSlice";
import searchIcon from "../../../assets/icons/searchIcon.svg";
import LoaderOverlay from "../../../ReusableComponents/LoaderOverlay";

const {confirm} = Modal;
const {Search} = Input;
const {Option} = Select;

const UserListTable = () => {
  const dispatch = useDispatch();
  const idToken = useSelector((state) => state.auth.idToken);
  const [searchText, setSearchText] = useState("");
  const [active, setActive] = useState(true);
  const [authType, setAuthType] = useState(null);
  const [activeStatus, setActiveStatus] = useState(null);
  const [pageSize, setPageSize] = useState(20);
  const [pageNo, setPageNo] = useState(1);
  const [category, setCategory] = useState("all");

  const {tableData, currentPage, totalPages, totalItems, isLoading} = useSelector((state) => state.list);

  useEffect(() => {
    if (idToken) {
      dispatch(
        fetchUserList({
          idToken,
          searchText,
          pageNo,
          pageSize,
          authType,
          active,
        }),
      );
    }
  }, [dispatch, idToken, searchText, pageNo, pageSize, authType, active]);

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      console.log(searchText, e.key);
      setSearchText(e.target.value);
    }
  };

  const handleResetClick = () => {};

  const handleCategoryChange = (value) => {
    setCategory(value);
  };

  const handleStatusChange = async (user) => {
    const status = user.is_active ? "disable" : "enable";
    const email = user.email;
    try {
      const response = await changeUserStatus(idToken, email, {status});
      if (response.status < 399) {
        dispatch(returnMessages(response.data.detail, response.status));
      } else {
        dispatch(returnErrors(response.response.data.detail || "Something went wrong", 400));
      }
    } catch (error) {
      dispatch(returnErrors("Error changing user status"));
    }
  };

  const handleResetPassword = async (email) => {
    try {
      const data = {email};
      const response = await resetPassword(idToken, data);
      if (response.status < 399) {
        dispatch(returnMessages(response.data.detail, response.status));
      } else {
        dispatch(returnErrors(response.response.data.detail || "Something went wrong", 400));
      }
    } catch (error) {
      dispatch(returnErrors("Error resetting password"));
    }
  };

  const handleDeleteUser = async (email) => {
    confirm({
      title: "Are you sure delete this user?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      async onOk() {
        // try {
        //   const response = await deleteUser(idToken, email);
        //   if (response.status < 399) {
        //     dispatch(returnMessages(response.data.detail, response.status));
        //   } else {
        //     dispatch(returnErrors(response.response.data.detail || "Something went wrong", 400));
        //   }
        // } catch (error) {
        //   dispatch(returnErrors("Error deleting user"));
        // }
      },
      onCancel() {},
    });
  };

  const onChangeActive = (e) => {
    setPageNo(1);
    e.target.value === true ? setActive(null) : setActive(true);
  };

  const onChangeAuthType = (e) => {
    setPageNo(1);
    setAuthType(e.target.value);
  };
  function triggerChange(page, updatedPageSize) {
    setPageNo(page);
    setPageSize(updatedPageSize);
  }

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      render: (text) => (
        <>
          {text}
          <CopyToClipboard text={text}>
            <Tooltip title="Copy email">
              <Button
                type="link"
                icon={<CopyOutlined style={{color: "#04D9FF"}} />}
                onClick={() => message.success("Copied email")}
              />
            </Tooltip>
          </CopyToClipboard>
        </>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => <span>{record.first_name ? `${record.first_name} ${record.last_name}` : "-"}</span>,
    },
    {
      title: "Date joined",
      dataIndex: "date_joined",
      render: (text) => <span>{moment(text).format("ll")}</span>,
    },
    {
      title: "Auth type",
      dataIndex: "auth_type",
      render: (text, record) => <span style={{textTransform: "capitalize"}}>{text}</span>,
    },
    {
      title: "Country",
      dataIndex: "country",
      render: (text, record) => (
        <Tooltip title={record.country || "N/A"}>
          <span>{record.country}</span>
        </Tooltip>
      ),
    },
    {
      title: "Active",
      dataIndex: "is_active",
      render: (text, record) => <span className={`status_wrapper ${record.is_active ? "active" : "blocked"}`}>{record.is_active ? "Active" : "Blocked"}</span>,
    },
    {
      title: "Action",
      dataIndex: "actions",
      render: (_, record) => (
        <div className="action_wrapper">
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item onClick={() => handleStatusChange(record)}>{record.is_active ? "Block" : "Activate"}</Menu.Item>
                {record.auth_type === "email" && <Menu.Item onClick={() => handleResetPassword(record.email)}>Reset Password</Menu.Item>}
                <Menu.Item onClick={() => handleDeleteUser(record.email)}>Delete</Menu.Item>
              </Menu>
            }
            trigger={["click"]}
          >
            <Button className="action_btn standard_button">Actions</Button>
          </Dropdown>
          {/* <Button onClick={() => handleStatusChange(record)}>
            {record.is_active ? "Block" : "Activate"}
          </Button>
          {record.auth_type === "email" && (
            <Button onClick={() => handleResetPassword(record.email)}>Reset Password</Button>
          )}
          <Button danger onClick={() => handleDeleteUser(record.email)}>
            Delete
          </Button> */}
        </div>
      ),
    },
  ];

  return (
    <div className="user_list_container">
      <div>
        <div className="header_wrapper">
          <h3 className="page_header">User List</h3>
          <Button
            // onClick={() => navigate('affiliateMarketing-logs')}
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
              <img
                src={searchIcon}
                alt="searchIcon"
              />
            </div>
          </div>
          <div className="table_header_filter_radio">
            <Radio.Group
              value={authType}
              onChange={onChangeAuthType}
            >
              <Radio.Button value={null}>All</Radio.Button>
              <Radio.Button value="email">Email</Radio.Button>
              <Radio.Button value="google">Google</Radio.Button>
            </Radio.Group>

            <Radio.Group value={active}>
              <Radio.Button
                onClick={() => {
                  active === true ? setActive(null) : setActive(true);
                }}
                value={true}
              >
                Active
              </Radio.Button>
              <Radio.Button
                onClick={() => {
                  active === false ? setActive(null) : setActive(false);
                }}
                value={false}
              >
                Inactive
              </Radio.Button>
            </Radio.Group>
          </div>
        </div>
      </div>
      {isLoading && <LoaderOverlay />}
      <AntTable
        data={tableData}
        columns={columns}
        totalPages={Math.ceil(totalItems / pageSize)}
        totalItems={totalItems}
        pageSize={pageSize}
        CurrentPageNo={pageNo}
        setPageSize={setPageSize}
        triggerChange={triggerChange}
      />
    </div>
  );
};

export default UserListTable;
