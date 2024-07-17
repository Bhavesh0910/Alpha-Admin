import {Button, DatePicker, Dropdown, Menu, Select} from "antd";
import moment from "moment";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {toast} from "react-toastify";
import searchIcon from "../../assets/icons/searchIcon.svg";
import comment from "../../assets/icons/comment.svg";
import RightMark from "../../assets/images/check_5610944.png";
import CrossMark from "../../assets/images/delete_14024972.png";
import AntTable from "../../ReusableComponents/AntTable/AntTable";
import LoaderOverlay from "../../ReusableComponents/LoaderOverlay";
import {DownOutlined} from "@ant-design/icons";
import "./StageManager.scss";
import {getStage1List} from "../../store/NewReducers/Support";
import ReactCountryFlag from "react-country-flag";
const {RangePicker} = DatePicker;

const {Option} = Select;

const StageManager = () => {
  const lookup = require("country-code-lookup");
  const type = "1_step";
  const [currentPage, setCurrentPage] = useState(1);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [activeTab, setActiveTab] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");

  const {idToken} = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const {count, data} = useSelector((state) => state.support);

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

  useEffect(() => {
    dispatch(getStage1List({idToken, query: ""}));
  }, [searchText, pageNo, pageSize, activeTab]);

  const handleCopyToClipboard = (text) => {
    toast("Copied email", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      type: "success",
      theme: "dark",
      className: "custom-toast-container",
    });
  };

  const columns = React.useMemo(
    () => [
      {
        title: "Flag",
        dataIndex: "country",
        key: "country",
        render: (country) => {
          console.log(country, "country");
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
              </div>
            );
          } else {
            return <span>{countryName}</span>;
          }
        },
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        render: (text) => (
          <div className="column_one_wrapper">
            {/* <div
              className="sno_wrapper"
              style={{
                backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
              }}
            >
              {text && text.charAt(0).toUpperCase()}
            </div> */}
            <div>{text}</div>
            {/* <CopyToClipboard onCopy={() => handleCopyToClipboard(text)} text={text}>
              <p
                className="table_copy_button"
                style={{
                  marginRight: "20px",
                  cursor: "pointer",
                }}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="24" height="24" rx="12" fill="#1E1E1E" />
                  <path
                    d="M17.886 12.574C18 12.2987 18 11.9487 18 11.25C18 10.5513 18 10.2013 17.886 9.926C17.8106 9.74395 17.7001 9.57854 17.5608 9.43922C17.4215 9.29989 17.256 9.18938 17.074 9.114C16.7987 9 16.4487 9 15.75 9H11.4C10.56 9 10.14 9 9.81933 9.16333C9.53684 9.30719 9.30719 9.53684 9.16333 9.81933C9 10.1393 9 10.5593 9 11.4V15.75C9 16.4487 9 16.7987 9.114 17.074C9.26667 17.4413 9.55867 17.734 9.926 17.886C10.2013 18 10.5513 18 11.25 18C11.9487 18 12.2987 18 12.574 17.886M17.886 12.574C17.8106 12.756 17.7001 12.9215 17.5608 13.0608C17.4215 13.2001 17.256 13.3106 17.074 13.386C16.7987 13.5 16.4487 13.5 15.75 13.5C15.0513 13.5 14.7013 13.5 14.426 13.614C14.244 13.6894 14.0785 13.7999 13.9392 13.9392C13.7999 14.0785 13.6894 14.244 13.614 14.426C13.5 14.7013 13.5 15.0513 13.5 15.75C13.5 16.4487 13.5 16.7987 13.386 17.074C13.3106 17.256 13.2001 17.4215 13.0608 17.5608C12.9215 17.7001 12.756 17.8106 12.574 17.886M17.886 12.574C17.5275 13.8107 16.8678 14.9391 15.9661 15.8582C15.0645 16.7774 13.9489 17.4585 12.7193 17.8407L12.574 17.886M15 9V8.4C15 7.56 15 7.14 14.8367 6.81933C14.693 6.53694 14.4636 6.3073 14.1813 6.16333C13.86 6 13.44 6 12.6 6H8.4C7.56 6 7.14 6 6.81933 6.16333C6.53684 6.30719 6.30719 6.53684 6.16333 6.81933C6 7.13933 6 7.55933 6 8.4V12.6C6 13.44 6 13.86 6.16333 14.1807C6.30733 14.4633 6.53667 14.6927 6.81933 14.8367C7.13933 15 7.56 15 8.40067 15H9"
                    stroke="#36D66B"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </p>
            </CopyToClipboard> */}
          </div>
        ),
      },
      {
        title: "Full Name",
        dataIndex: "full_name",
        key: "full_name",
        render: (text) => (text ? text : "-"),
      },
      {
        title: "Account",
        dataIndex: "account",
        key: "account",
        render: (text, row) => (
          <Link
            to="/trader-overview"
            // onClick={() => handleActiveAccount(row, "account")}
          >
            {text ? text : "-"}
          </Link>
        ),
      },
      {
        title: "Funded",
        dataIndex: "funded_account",
        key: "funded_account",
        render: (text, row) => (
          <Link
            to="/traders-list-2"
            // onClick={() => handleActiveAccount(row, "funded_account")}
          >
            {text ? text : "-"}
          </Link>
        ),
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (text) => (
          <span
            style={{
              textWrap: "nowrap",
              textTransform: "capitalize",
              color: text === "approved" ? "#209829" : text === "rejected" ? "#FA4D4D" : text === "new" ? "#00000" : "#FFB100",
            }}
          >
            {text ? text.replace(/_/g, " ") : "-"}
          </span>
        ),
      },
      {
        title: "Email Generated",
        dataIndex: "email_generated",
        key: "email_generated",
        render: (text, row) => (
          <img
            width={"25px"}
            src={text || row.status === "approved" ? RightMark : CrossMark}
            alt=""
          />
        ),
      },
      {
        title: "Credential Generated",
        dataIndex: "credential_generated",
        key: "credential_generated",
        render: (text, row) => (
          <img
            width={"25px"}
            src={text || row.status === "approved" ? RightMark : CrossMark}
            alt=""
          />
        ),
      },
      {
        title: "Contract Issued",
        dataIndex: "contract_issued",
        key: "contract_issued",
        render: (text, row) => (
          <img
            width={"25px"}
            src={text || row.status === "approved" ? RightMark : CrossMark}
            alt=""
          />
        ),
      },
      {
        title: "KYC Verified",
        dataIndex: "kyc_verified",
        key: "kyc_verified",
        render: (text) => (
          <img
            width={"25px"}
            src={text ? RightMark : CrossMark}
            alt=""
          />
        ),
      },
      {
        title: "Payment",
        dataIndex: "payment",
        key: "payment`",
        render: (text, row) => (
          <img
            width={"25px"}
            src={text || row.status === "approved" ? RightMark : CrossMark}
            alt=""
          />
        ),
      },
      {
        title: "Date (created at)",
        dataIndex: "created_at",
        key: "created_at",
        render: (text) => moment(text).format("MMMM Do YYYY, h:mm:ss a"),
      },
      {
        title: "Date (last updated)",
        dataIndex: "updated_at",
        key: "updated_at",
        render: (text) => moment(text).format("MMMM Do YYYY, h:mm:ss a"),
      },
      {
        title: "Action",
        key: "action",
        render: (text, row) => (
          <Dropdown
            overlay={
              <Menu>
                {/* <Menu.Item onClick={() => handleGenerateContract(row)}>{row.contract_issued ? "Revoke" : "Generate"} Contract</Menu.Item> */}
                {/* <Menu.Item onClick={() => handleGenerateContract(row, "reject")}>Reject Contract</Menu.Item> */}
              </Menu>
            }
            trigger={["click"]}
          >
            <Button className="action_btn standard_button">Actions</Button>
          </Dropdown>
        ),
      },
      {
        title: "Comment",
        dataIndex: "comment",
        key: "comment",
        render: (text, record, index) => (
          <div className="comment_box">
            {/* <p>{highlightText(text, searchText)}</p> */}
            <img
              src={comment}
              alt="comment"
              className="edit-icon"
              // onClick={() => openEditModal(text, index)}
            />
          </div>
        ),
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (text, record, index) => (
          <Dropdown
            overlay={() => statusMenu(index)}
            trigger={["click"]}
          >
            <Button
              icon={<DownOutlined />}
              className="status_button"
              style={{
                width: "120px",
                display: "flex",
                flexDirection: "row-reverse",
                justifyContent: "space-between",
                padding: "6px 10px",
              }}
            >
              <p
                className={
                  text === "in-progress" ? "in_progress" : text === "approved" ? "approved" : text === "flagged" ? "flagged" : text === "dismissed" ? "dismissed" : text === "new" ? "new" : ""
                }
              >
                {text === "in-progress" ? "In Progress" : text === "approved" ? "Approved" : text === "flagged" ? "Flagged" : text === "dismissed" ? "Dismissed" : text === "new" ? "New" : ""}
              </p>
            </Button>
          </Dropdown>
        ),
      },
      {
        title: "Phase 1 ID",
        dataIndex: "phase1_id",
        key: "phase1_id",
      },
      {
        title: "Detail",
        dataIndex: "detail",
        key: "detail",
        render: (text) => {
          <Button className="accnt_metrics_btn standard_button">Account Metrics</Button>;
        },
      },
      {
        title: "Action",
        dataIndex: "action",
        key: "action",
        render: (text) => {
          <Button className="action_btn standard_button">Create Account</Button>;
        },
      },
    ],
    [],
  );

  const handleSearch = (value) => {
    setPageNo(1);
    setPageSize(20);
    setSearchText(value);
  };

  const handleTabChange = (key) => {
    setPageNo(1);
    setActiveTab(key);
  };

  const handleCategoryChange = (value) => {
    // setCategory(value);
  };

  function triggerChange(page, updatedPageSize) {
    setPageNo(page);
    setPageSize(updatedPageSize);
  }
  return (
    <div className="stageManager_container">
      <div className="header_wrapper">
        <h2>Stage 1</h2>
        <Button
          // onClick={() => navigate("payments-view-logs")}
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
            {/* <Option value="swift">Swift</Option>
            <Option value="wire">Wire</Option> */}
          </Select>
          <input
            placeholder="Search..."
            className="search_input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch(e.target.value);
              }
            }}
          />
          <div
            className="searchImg"
            onClick={() => handleSearch(search)}
          >
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
            className={activeTab === "inprogress" ? "active" : ""}
            onClick={() => handleTabChange("in_progress")}
          >
            In Progress
          </Button>
          <Button
            className={activeTab === "rejected" ? "active" : ""}
            onClick={() => handleTabChange("rejected")}
          >
            Rejected
          </Button>
        </div>{" "}
        <RangePicker
          // placeholder={dates}
          //  defaultValue={defaultDates}
          // onChange={updateDateRange}
          autoFocus
          // presets={rangePresets}
        />
      </div>
      {isLoading && <LoaderOverlay />}

      <AntTable
        columns={columns}
        data={data || []}
        totalPages={Math.ceil(count / pageSize)}
        totalItems={count}
        pageSize={pageSize}
        CurrentPageNo={pageNo}
        setPageSize={setPageSize}
        triggerChange={triggerChange}
      />
      {/* <Modal
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
      </Modal> */}
    </div>
  );
};

export default StageManager;
