import React, {useEffect, useState} from "react";
import "./UserList.scss";
import {Table, Input, Select, Button, Modal, Tooltip, message, Radio} from "antd";
import moment from "moment";
import {CopyOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import CopyToClipboard from "react-copy-to-clipboard";
import {fetchUserList, toggleActiveUser} from "../../../store/NewReducers/listSlice";
import searchIcon from "../../../assets/icons/searchIcon.svg";
import LoaderOverlay from "../../../ReusableComponents/LoaderOverlay";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import {returnMessages} from "../../../store/reducers/message";
import {returnErrors} from "../../../store/reducers/error";
import ReactCountryFlag from "react-country-flag";

const {confirm} = Modal;
const {Search} = Input;
const {Option} = Select;

const UserListTable = () => {
  const lookup = require("country-code-lookup");

  const dispatch = useDispatch();
  const idToken = useSelector((state) => state.auth.idToken);
  const [searchText, setSearchText] = useState("");
  const [active, setActive] = useState(true);
  const [authType, setAuthType] = useState(null);
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
          active: active ? 1 : 0,
        }),
      );
    }
  }, [dispatch, idToken, searchText, pageNo, pageSize, authType, active]);

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
          dispatch(toggleActiveUser({id, note, idToken}));
          dispatch(returnMessages(`User ${user.is_active ? "blocked" : "activated"} successfully.`));
          dispatch(fetchUserList({idToken, searchText, pageNo, pageSize, authType, active}));
        } catch (error) {
          dispatch(returnErrors("Error changing user status."));
        }
      },
      onCancel() {},
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
      onCancel() {},
    });
  };

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
      render: (country) => {
        const countryName = country;
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
          return <span>{countryName || "N/A"}</span>;
        }
      },
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
          <Button onClick={() => handleStatusChange(record)}>{record.is_active ? "Block" : "Activate"}</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="user_list_container">
      <div>
        <div className="header_wrapper">
          <h3 className="page_header">User List</h3>
          <Button className="view_logs__btn standard_button">View Logs</Button>
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
            {/* <Radio.Group value={authType} onChange={onChangeAuthType}>
              <Radio.Button value={null}>All</Radio.Button>
              <Radio.Button value="email">Email</Radio.Button>
              <Radio.Button value="google">Google</Radio.Button>
            </Radio.Group> */}

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
