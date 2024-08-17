import React, {useEffect, useRef, useState} from "react";
import "./Payout.scss";
import ArrowUpGreen from "../../../assets/icons/upArrowGreen.svg";
import exportIcon from "../../../assets/icons/export_btn_icon.svg";
import {Link, useNavigate} from "react-router-dom";
import LoaderOverlay from "../../../ReusableComponents/LoaderOverlay";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import {useDispatch, useSelector} from "react-redux";
import {fetchPayout, fetchWithdrawalsDetails} from "../../../store/NewReducers/advanceStatistics";
import moment from "moment/moment";

const Payout = () => {
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [category, setCategory] = useState("all");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [filterData, setFilterData] = useState([]);
  const [pageSize, setPageSize] = useState(20);
  const [pageNo, setPageNo] = useState(1);

  const {withdrawalsDetails, isLoading} = useSelector((state) => state.advanceStatistics);
  const {idToken} = useSelector((state) => state.auth);

  // Fetch PassRates Data
  useEffect(() => {
    let query = `?page=${pageNo || 1}&page_size=${pageSize || 20}`;

    if (searchText) {
      query = query + `&search=${searchText}`;
    }

    dispatch(fetchWithdrawalsDetails({idToken, query}));
  }, [dispatch, idToken, pageNo, pageSize, searchText]);

  const searchRef = useRef();

  function triggerChange(page, updatedPageSize) {
    setPageNo(page);
    setPageSize(updatedPageSize);
  }

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

  const handleRowClick = (affiliateId, email) => {
    const url = `/affiliate-marketing/code?email=${email}`;
    navigate(url);
  };

  const columns = [
    {
      title: "Login ID",
      dataIndex: "login_id",
      key: "login_id",
      render: (text) => text || "-",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => text || "-",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => text || "-",
    },
    {
      title: "Plan",
      dataIndex: "plan",
      key: "plan",
      render: (text) => text || "-",
    },
    {
      title: "Start Balance",
      dataIndex: "starting_balance",
      key: "starting_balance",
      render: (text) => text || "-",
    },
    {
      title: "Current Balance",
      dataIndex: "current_balance",
      key: "current_balance",
      render: (text) => text || "-",
    },
    {
      title: "Current Equity",
      dataIndex: "current_equity",
      key: "current_equity",
      render: (text) => text || "-",
    },
    {
      title: "Profit Share",
      dataIndex: "profit_share",
      key: "profit_share",
      render: (text) => text || "-",
    },
    {
      title: "Profit",
      dataIndex: "profit",
      key: "profit",
      render: (text) => Number(text).toFixed(2) || "-",
    },
    {
      title: "Bonus",
      dataIndex: "bonus",
      key: "bonus",
      render: (text) => text || "-",
    },
    {
      title: "Withdraw Profit",
      dataIndex: "withdraw_profit",
      key: "withdraw_profit",
      render: (text) => Number(text).toFixed(2) || "-",
    },
    {
      title: "Verification Type",
      dataIndex: "verification_type",
      key: "verification_type",
      render: (text) => text || "-",
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
      render: (text) => moment(text).format("DD MM YYYY") || "-",
    },
    {
      title: "Next Payout Date",
      dataIndex: "next_payout_date",
      key: "next_payout_date",
      render: (text) => moment(text).format("DD MM YYYY") || "-",
    },
  ];

  return (
    <>
      <div className="payout_main">
        <div className="payout_header">
          <h2>Payout</h2>
        </div>
        <div className="payout_lower_heading">
          <div className="payout_lower_heading_left">
            <h3>
              Total New Payment Request <span>(Today)</span>
            </h3>
            <div className="payout_lower_heading_inner">
              <h2>25656</h2>
              <button>
                <img
                  src={ArrowUpGreen}
                  alt="ArrowUpGreen"
                />
                <p>5%</p>
              </button>
            </div>
          </div>

          <div className="payout_btn_wrapper">
            <div className="payout_btn">
              <img
                src={exportIcon}
                alt="exportIcon"
              />
              <button>Export</button>
            </div>
            <Link to="/advance-statistics/payout-export-history">
              <p>View Export History</p>
            </Link>
          </div>
        </div>

        <div className="payout_lower_heading_two">
          <div className="left">
            <h3>Eligible Payment List</h3>
          </div>
          <button className="right">Expected Tomorrow</button>
        </div>

        <div>
          {isLoading ? (
            <LoaderOverlay />
          ) : (
            <AntTable
              data={withdrawalsDetails?.results || []}
              columns={columns}
              totalPages={Math.ceil(withdrawalsDetails?.count / pageSize)}
              totalItems={withdrawalsDetails?.count}
              pageSize={pageSize}
              CurrentPageNo={pageNo}
              setPageSize={setPageSize}
              triggerChange={triggerChange}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Payout;
