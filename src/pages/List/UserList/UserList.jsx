import React, { useEffect, useMemo, useState } from "react";
import "./UserList.scss";
import { Table, Input, Select, Button, Modal, Tooltip, message, Radio, Form, Input as AntInput, Dropdown, Menu } from "antd";
import moment from "moment";
import { CopyOutlined, DownOutlined, ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import CopyToClipboard from "react-copy-to-clipboard";
import { fetchUserList, softBlockUser, toggleActiveUser, updateFlagReq, updateUser } from "../../../store/NewReducers/listSlice";
import searchIcon from "../../../assets/icons/searchIcon.svg";
import LoaderOverlay from "../../../ReusableComponents/LoaderOverlay";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import { returnMessages } from "../../../store/reducers/message";
import ReactCountryFlag from "react-country-flag";
import { useNavigate } from "react-router-dom";
import blockIcon from '../../../assets/icons/block.svg';
import unblockIcon from '../../../assets/icons/unblock.svg';
import editIcon from '../../../assets/icons/edit.svg';

const { confirm } = Modal;
const { Option } = Select;

const UserListTable = () => {
  const lookup = require("country-code-lookup");

  const [form] = Form.useForm();

  const dispatch = useDispatch();
  const idToken = useSelector((state) => state.auth.idToken);
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  const [active, setActive] = useState(true);
  const [authType, setAuthType] = useState(null);
  const [pageSize, setPageSize] = useState(20);
  const [pageNo, setPageNo] = useState(1);
  const [category, setCategory] = useState("all");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [blockModalVisible, setBlockModalVisible] = useState(false);
  const [blockType, setBlockType] = useState('hard');
  const [flagUser, setFlagUser] = useState(null);
  const [flagModal, setFlagModel] = useState(false);
  const [flagUpdatedValue, setFlagUpdatedValue] = useState(null);
  const [comment, setComment] = useState(null);

  const { tableData, currentPage, totalPages, totalItems, isLoading, flagLoading, refetch } = useSelector((state) => state.list);
  const { msg, title, status } = useSelector((state) => state.message);

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

  const handleSearch = (value) => {
    setPageNo(1);
    setPageSize(20);
    setSearchText(value);
  };
  const handleResetClick = () => {
    setSearchText("");
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
  };

  const handleBlockUser = async () => {
    if (blockType === 'hard') {
      await dispatch(toggleActiveUser({ id: selectedUser.id, note: 'Hard blocking user', idToken })).unwrap();
      await dispatch(returnMessages("User blocked successfully.", "success"));
    } else if (blockType === 'soft') {
      await dispatch(softBlockUser({ id: selectedUser.id, note: 'Soft blocking user', idToken })).unwrap();
      await dispatch(returnMessages("User blocked successfully.", "success"));
    }

    setBlockModalVisible(false);
    dispatch(fetchUserList({ idToken, searchText, pageNo, pageSize, authType, active }));
  };

  const handleStatusChange = (user) => {
    if (user.is_active && !user?.soft_blocked) {
      setSelectedUser(user);
      setBlockModalVisible(true);
    } else {
      confirm({
        className: 'confirm_modal',
        title: `Are you sure you want to unblock this user?`,
        icon: <ExclamationCircleOutlined />,
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        onOk: async () => {
          try {
            if (user?.soft_blocked) {
              await dispatch(softBlockUser({ id: user.id, note: 'Unblocking user', idToken })).unwrap();
            } else {
              await dispatch(toggleActiveUser({ id: user.id, note: 'Unblocking user', idToken })).unwrap();
            }
            dispatch(returnMessages("User unblocked successfully.", "success"));
            dispatch(fetchUserList({ idToken, searchText, pageNo, pageSize, authType, active }));
          } catch (error) {
            dispatch(returnMessages("Error unblocking user.", "error"));
          }
        },
      });
    }
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
    dispatch(updateFlagReq({ idToken, body: formData, id: flagUser?.id }));
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

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
      };

      dispatch(updateUser({ payload, idToken, dispatch }));
      dispatch(fetchUserList({ idToken, searchText: '', pageNo: 1, pageSize, authType, active }));
      setSearchText('')

      setIsModalVisible(false);
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

  const columns = useMemo(()=>[
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
      title: "Email",
      dataIndex: "email",
      render: (text) => (
        <>
          {text || "-"}
          <CopyToClipboard text={text || "-"}>
            <Tooltip title="Copy email">
              <Button
                type="link"
                icon={<CopyOutlined style={{ color: "#04D9FF" }} />}
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
      title: "Active",
      dataIndex: "is_active",
      render: (text) => <span className={`status_wrapper ${text ? "active" : "blocked"}`}>{text !== undefined ? (text ? "Active" : "Blocked") : "-"}</span>,
    },
    {
      title: "Block Type",
      dataIndex: "soft_blocked",
      width: 120,
      render: (_, record) => {
        if (!record.is_active) {
          return <span>Hard Blocked</span>;
        }
        return record.soft_blocked ? <span>Soft Blocked</span> : <span>Unblocked</span>;
      },
    },
    {
      title: "Action",
      dataIndex: "actions",
      render: (_, record) => (
        <div className="action_wrapper">
          <div
            title={`${record.is_active && !record.soft_blocked ? "Block" : "Unblock"}`}
            onClick={() => handleStatusChange(record)}
            disabled={record.is_active === undefined}
          >
            {record.is_active && !record.soft_blocked ? 
              <img src={blockIcon} alt="Block" /> 
              : !record.is_active || record?.soft_blocked ? 
              <img src={unblockIcon} alt="Unblock" /> 
              : "-"}
          </div>
          <div
            title="Edit"
            onClick={() => handleEditClick(record)}
            style={{ cursor: 'pointer' }}
          >
            <img src={editIcon} alt="Edit" />
          </div>
        </div>
      ),
    },
  ]);
  

  const handleExpand = (record) => {
  };

  console.log(tableData);
  const ExpandedRowRender = ({ record }) => {
    return (
      <div className="expanded-row-content">
        <div>
          <p><strong>Name: </strong> {record.full_name || "-"}</p>
        </div>
        <div>
          <p><strong>Date Joined: </strong> {record.date_joined ? moment(record.date_joined).format("ll") : "-"}</p>
        </div>
      </div>
    );
  };

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
            <input
              placeholder="Search by email..."
              className="search_input"
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch(e.target.value);
                }
              }}
              />
            <div className="searchImg" onClick={() => handleSearch(search)}>
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
        data={tableData?.results}
        columns={columns}
        totalPages={Math.ceil(tableData?.count / pageSize)}
        totalItems={tableData?.count}
        pageSize={pageSize}
        CurrentPageNo={pageNo}
        setPageSize={setPageSize}
        triggerChange={triggerChange}
        isExpandable={true}
        ExpandedComp={ExpandedRowRender}
        rowId="id"
        scrollY={420}
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
              rules={[{ required: true, message: "Please input the full name" }]}
            >
              <AntInput placeholder="Enter full name" />
            </Form.Item>
            <Form.Item
              name="Email"
              label="Email"
              rules={[
                { required: true, message: "Please input the email" },
                { type: "email", message: "Please enter a valid email" },
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

      <Modal
        title={"Block User"}
        visible={blockModalVisible}
        onCancel={() => setBlockModalVisible(false)}
        onOk={handleBlockUser}
      >
        <Form.Item label="Select Block Type">
          <Select
            defaultValue="hard"
            onChange={(value) => setBlockType(value)}
          >
            <Option value="hard">Hard Block</Option>
            <Option value="soft">Soft Block</Option>
          </Select>
        </Form.Item>
      </Modal>

    </div>
  );
};

export default UserListTable;
