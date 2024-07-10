import React, {useState, useEffect} from "react";
import "./StageManager.scss";
import AntTable from "../../ReusableComponents/AntTable/AntTable";
import {Button, Dropdown, Menu, Select, Tooltip, notification} from "antd";
import searchIcon from "../../assets/icons/searchIcon.svg";
import greenTickIcon from "../../assets/icons/greenTick.svg";
import crossRedIcon from "../../assets/icons/cross_icon_red.svg";
import {ReactComponent as CopyButton} from "../../assets/icons/copyButtonGray.svg";
import {useDispatch, useSelector} from "react-redux";
import {generateContractRequest, getSupportTableDetailsNew} from "../../utils/api/apis";
import {returnErrors} from "../../store/reducers/error";
import {setIsLoading} from "../../store/reducers/authSlice";
import {returnMessages} from "../../store/reducers/message";
import {toast} from "react-toastify";
import CopyToClipboard from "react-copy-to-clipboard";
import CrossMark from "../../assets/images/delete_14024972.png";
import RightMark from "../../assets/images/check_5610944.png";
import {Link} from "react-router-dom";
import moment from "moment";
import {setActiveAccount, setActiveUser} from "../../store/reducers/accountSlice";
import LoaderOverlay from "../../ReusableComponents/LoaderOverlay";

const {Option} = Select;

const StageManager = () => {
  const type = "1_step";
  // const [category, setCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTraders, setTotalTraders] = useState(0);
  const [allTraders, setAllTraders] = useState([]);
  // console.log(status, "statusstatusstatusstatus");
  const [refresh, setRefresh] = useState(false);

  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalItems, setTotalItems] = useState(1);

  const [activeTab, setActiveTab] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");

  const idToken = useSelector((state) => state.auth.idToken);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData(idToken, searchText, pageNo, pageSize, activeTab);
  }, [refresh, searchText, pageNo, pageSize, activeTab]);

  const addPadding = (tableData, pageNumber) => {
    const padding = [];
    for (let index = 0; index < (pageNumber - 1) * 50; index++) {
      padding.push({
        id: `padding-${index}`,
        name: "",
        accountNumber: "",
        startDate: "",
        endDate: "",
        percentageOfGoodTrades: "",
        percentageOfBadTrades: "",
      });
    }

    return [...padding, ...tableData];
  };

  const fetchData = async (idToken, searchText, pageNo, pageSize, activeTab) => {
    setIsLoading(true);

    try {
      const data = await getSupportTableDetailsNew(idToken, searchText, pageNo, pageSize, activeTab);

      setTotalTraders(data?.count);
      setAllTraders(addPadding(data?.results, currentPage));
    } catch (error) {
      console.error("Error fetching data:", error);
      dispatch(returnErrors(error?.response?.data?.detail || "Something went Wrong!", 400));
    } finally {
      setIsLoading(false);
    }
  };

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
            onClick={() => handleActiveAccount(row, "account")}
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
            onClick={() => handleActiveAccount(row, "funded_account")}
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
                <Menu.Item onClick={() => handleGenerateContract(row)}>{row.contract_issued ? "Revoke" : "Generate"} Contract</Menu.Item>
                <Menu.Item onClick={() => handleGenerateContract(row, "reject")}>Reject Contract</Menu.Item>
              </Menu>
            }
            trigger={["click"]}
          >
            <Button className="action_btn standard_button">Actions</Button>
          </Dropdown>
        ),
      },
    ],
    [],
  );

  const typename = type === "1_step" ? "1 Step id" : "2 Step id";
  const handleActiveAccount = (row, msg) => {
    row.original?.account && msg === "account"
      ? dispatch(setActiveAccount(row.original.account))
      : row.original?.account && msg === "funded_account"
      ? dispatch(setActiveAccount(row.original?.funded_account))
      : dispatch(setActiveAccount(null));
    dispatch(setActiveUser({...row.original}));
  };

  const handleGenerateContract = async (row, action = "") => {
    try {
      const data = {
        action: action ? action : row?.contract_issued ? "revoke" : "generate",
      };
      const response = await generateContractRequest(idToken, row?.id, data);
      if (response?.data?.detail) {
        dispatch(returnMessages(response?.data?.detail, response?.status));
        setRefresh(!refresh);
      } else {
        dispatch(returnErrors(response?.response?.data?.detail, response?.response?.status));
      }
    } catch (error) {
      console.error("Error in generating/rejecting contract:", error);
      dispatch(returnErrors("Failed to perform action", 500));
    }
  };
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
    console.log("Updated page no : ", page);
    console.log("Updated page no : ", updatedPageSize);
    setPageNo(page);
    setPageSize(updatedPageSize);
  }
  return (
    <div className="stageManager_container">
      {/* <h2>Stage Manager</h2> */}
      <div className="mobile_headers">
        <h4>Stage Manager</h4>
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
        </div>
      </div>
      {isLoading && <LoaderOverlay />}

      <AntTable
        columns={columns}
        data={allTraders}
        totalPages={Math.ceil(totalItems / pageSize)}
        totalItems={totalTraders}
        pageSize={pageSize}
        CurrentPageNo={pageNo}
        setPageSize={setPageSize}
        triggerChange={triggerChange}
      />
    </div>
  );
};

export default StageManager;
