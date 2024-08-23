import React, {useEffect, useState} from "react";
import "./UserList.scss";
import {Table, Input, Select, Button, Modal, Tooltip, message, Radio, Form, Input as AntInput, Dropdown, Menu} from "antd";
import moment from "moment";
import {CopyOutlined, DownOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import CopyToClipboard from "react-copy-to-clipboard";
import {fetchUserList, toggleActiveUser, updateFlagReq, updateUser} from "../../../store/NewReducers/listSlice";
import searchIcon from "../../../assets/icons/searchIcon.svg";
import LoaderOverlay from "../../../ReusableComponents/LoaderOverlay";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import {returnMessages} from "../../../store/reducers/message";
import ReactCountryFlag from "react-country-flag";
import {useNavigate} from "react-router-dom";
import {baseUrl} from "../../../utils/api/apis";
import axios from "axios";

const {confirm} = Modal;
const {Option} = Select;

const UserListTable = () => {
  const lookup = require("country-code-lookup");

  const [form] = Form.useForm();

  const dispatch = useDispatch();
  const idToken = useSelector((state) => state.auth.idToken);
  const [searchText, setSearchText] = useState("");
  const [active, setActive] = useState(true);
  const [authType, setAuthType] = useState(null);
  const [pageSize, setPageSize] = useState(20);
  const [pageNo, setPageNo] = useState(1);
  const [category, setCategory] = useState("all");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [flagUser, setFlagUser] = useState(null);
  const [flagModal, setFlagModel] = useState(false);
  const [flagUpdatedValue, setFlagUpdatedValue] = useState(null);
  const [comment, setComment] = useState(null);

  const {tableData, currentPage, totalPages, totalItems, isLoading, flagLoading, refetch} = useSelector((state) => state.list);
  const {msg, title, status} = useSelector((state) => state.message);

  useEffect(() => {
    if (idToken) {
      dispatch(
        fetchUserList({
          idToken,
          searchText,
          pageNo,
          pageSize,
          authType,
          active: active ? 1 : 0,
        }),
      );
    }
  }, [dispatch, idToken, searchText, pageNo, pageSize, authType, active, refetch]);

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setSearchText(e.target.value);
    }
  };

  const handleResetClick = () => {
    setSearchText("");
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
  };

  const handleStatusChange = async (user) => {
    confirm({
      title: `Are you sure you want to ${user.is_active ? "block" : "activate"} this user?`,
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        const id = user.id;
        const note = user.is_active ? "Deactivating user" : "Activating user";
        try {
          await dispatch(toggleActiveUser({id, note, idToken})).unwrap();
          dispatch(returnMessages(`User ${user.is_active ? "blocked" : "activated"} successfully.`, "success"));
          dispatch(fetchUserList({idToken, searchText, pageNo, pageSize, authType, active}));
        } catch (error) {
          dispatch(returnMessages("Error changing user status.", "error"));
        }
      },
    });
  };

  const handleResetPassword = async (email) => {
    // Your reset password logic here
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
        // Your delete user logic here
      },
    });
  };

  function handleUpdateFlag() {
    const formData = new FormData();
    formData.append("status", flagUpdatedValue);
    formData.append("notes", comment);
    dispatch(updateFlagReq({idToken, body: formData, id: flagUser?.id}));
    setFlagModel(false);
    reset();
  }

  const onChangeActive = (e) => {
    setPageNo(1);
    setActive(e.target.value);
  };

  const onChangeAuthType = (e) => {
    setPageNo(1);
    setAuthType(e.target.value);
  };

  const triggerChange = (page, updatedPageSize) => {
    setPageNo(page);
    setPageSize(updatedPageSize);
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
    form.setFieldsValue({
      full_name: user.full_name,
      Email: user.email,
      Country: user.country,
      City: user.city,
      Contact: user.contact,
      date_joined: moment(user.date_joined).format("YYYY-MM-DD"),
    });
  };

  // const handleModalOk = () => {
  //   // Implement save logic here
  //   setIsModalVisible(false);
  // };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        // ...selectedUser,
        ...values,
      };

      dispatch(updateUser({payload, idToken, dispatch}));

      // const response = await axios.patch(`${baseUrl}profile/update/`, payload, {
      //   headers: {
      //     Authorization: `Bearer ${idToken}`,
      //     "Content-Type": "application/json",
      //   },
      // });

      // if (response.status !== 200) {
      //   throw new Error("Failed to update user");
      // }

      // message.success("User updated successfully");
      setIsModalVisible(false);
      dispatch(fetchUserList({idToken, searchText, pageNo, pageSize, authType, active}));
    } catch (error) {
      message.error(error.message || "Error updating user");
    }
  };
  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  function reset() {
    setFlagUser(null);
    setFlagUpdatedValue(null);
    setComment(null);
  }
  const openStatusUpdateModal = (updatedValue, record) => {
    setFlagModel(true);
    setFlagUser(record);
    setFlagUpdatedValue(updatedValue);
  };

  const statusMenu = (key, record) => (
    <Menu
      className="menuCard"
      onClick={(e) => openStatusUpdateModal(e.key, record)}
    >
      <Menu.Item key="Safe">Safe</Menu.Item>
      <Menu.Item key="Warning">Warning</Menu.Item>
      <Menu.Item key="Blacklisted">Blacklisted</Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: "Flag",
      dataIndex: "status",
      width: "80px",
      render: (text, record) => (
        <div className="flagContainer">
          <p className={`flag ${text === "Blacklisted" ? "Red" : text === "Warning" ? "Yellow" : "Green"}`}></p>
          <Dropdown
            overlay={() => statusMenu(text, record)}
            trigger={["click"]}
          >
            <DownOutlined />
          </Dropdown>
        </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "full_name",
      render: (text) => <span>{text || "-"}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text) => (
        <>
          {text || "-"}
          <CopyToClipboard text={text || "-"}>
            <Tooltip title="Copy email">
              <Button
                type="link"
                icon={<CopyOutlined style={{color: "#04D9FF"}} />}
                onClick={() => message.success("Copied email")}
                disabled={!text}
              />
            </Tooltip>
          </CopyToClipboard>
        </>
      ),
    },
    {
      title: "Country",
      dataIndex: "country",
      render: (country) => {
        const countryName = country || "-";
        const countryCode = lookup.byCountry(countryName);
        if (countryCode) {
          return (
            <div className="country_name_wrapper">
              <ReactCountryFlag
                countryCode={countryCode.internet === "UK" ? "GB" : countryCode.internet}
                svg={true}
                aria-label={countryName}
              />
              <p>{countryName}</p>
            </div>
          );
        } else {
          return <span>{countryName}</span>;
        }
      },
    },
    {
      title: "City",
      dataIndex: "city",
      render: (text) => <span>{text || "-"}</span>,
    },
    {
      title: "Contact",
      dataIndex: "contact",
      render: (text) => <span>{text || "-"}</span>,
    },
    {
      title: "Date joined",
      dataIndex: "date_joined",
      render: (text) => <span>{text ? moment(text).format("ll") : "-"}</span>,
    },
    {
      title: "Active",
      dataIndex: "is_active",
      render: (text, record) => <span className={`status_wrapper ${record.is_active ? "active" : "blocked"}`}>{record.is_active !== undefined ? (record.is_active ? "Active" : "Blocked") : "-"}</span>,
    },
    {
      title: "Action",
      dataIndex: "actions",
      render: (_, record) => (
        <div className="action_wrapper">
          <Button onClick={() => handleEditClick(record)}>Edit</Button>
          <Button
            onClick={() => handleStatusChange(record)}
            disabled={record.is_active === undefined}
          >
            {record.is_active !== undefined ? (record.is_active ? "Block" : "Activate") : "-"}
          </Button>
        </div>
      ),
    },
  ];

  const navigate = useNavigate();

  return (
    <div className="user_list_container">
      <div>
        <div className="header_wrapper">
          <h3 className="page_header">User List</h3>
          <Button
            onClick={() => navigate("/list/user-list/user-logs")}
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
              value={active}
              onChange={onChangeActive}
            >
              <Radio.Button value={true}>Active</Radio.Button>
              <Radio.Button value={false}>Inactive</Radio.Button>
            </Radio.Group>
          </div>
        </div>
      </div>
      {(isLoading || flagLoading) && <LoaderOverlay />}
      <AntTable
        data={tableData}
        columns={columns}
        totalPages={Math.ceil(totalItems / pageSize)}
        totalItems={totalItems}
        pageSize={pageSize}
        CurrentPageNo={pageNo}
        setPageSize={setPageSize}
        triggerChange={triggerChange}
        customRowClass={true}
      />
      <Modal
        title="Edit User"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Save"
        cancelText="Cancel"
      >
        {selectedUser && (
          <Form
            form={form}
            layout="vertical"
          >
            <Form.Item
              name="full_name"
              label="Full Name"
              rules={[{required: true, message: "Please input the full name"}]}
            >
              <AntInput placeholder="Enter full name" />
            </Form.Item>
            <Form.Item
              name="Email"
              label="Email"
              rules={[
                {required: true, message: "Please input the email"},
                {type: "email", message: "Please enter a valid email"},
              ]}
            >
              <AntInput placeholder="Enter email" />
            </Form.Item>
            <Form.Item
              name="City"
              label="City"
            >
              <AntInput placeholder="Enter city" />
            </Form.Item>
            <Form.Item
              name="Contact"
              label="Contact"
            >
              <AntInput placeholder="Enter contact" />
            </Form.Item>
            <Form.Item
              name="Country"
              label="Country"
            >
              <AntInput placeholder="Enter country" />
            </Form.Item>
          </Form>
        )}
      </Modal>
      <Modal
        title={"Flag User"}
        open={flagModal}
        className="reset"
        onCancel={() => {
          reset();
          setFlagModel(false);
        }}
        onOk={handleUpdateFlag}
      >
        <Form.Item
          label="Reason"
          value={comment}
          className="reset"
          onChange={(e) => setComment(e.target.value)}
        >
          <Input.TextArea placeholder="Write your comment here.." />
        </Form.Item>
      </Modal>
    </div>
  );
};

export default UserListTable;
