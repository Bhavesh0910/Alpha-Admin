import React, { useEffect, useMemo, useState } from "react";
import { DatePicker, Button, Select, Tooltip, notification, Card, Dropdown, Menu, Modal, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import searchIcon from "../../../assets/icons/searchIcon.svg";
import exportBtnIcon from "../../../assets/icons/export_btn_icon.svg";
import { ReactComponent as CopyButton } from "../../../assets/icons/copyButtonGray.svg";
import dayjs from "dayjs";
import LoaderOverlay from "../../../ReusableComponents/LoaderOverlay";
import { CloseOutlined, DownOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import "./WithdrawalDetails.scss";
import { fetchWithdrawalsDetails, fetchWithdrawalsStatus } from "../../../store/NewReducers/advanceStatistics";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import { returnMessages } from "../../../store/reducers/message";
import { returnErrors } from "../../../store/reducers/error";
import { exportDataReq } from "../../../store/NewReducers/exportSlice";

const { Option } = Select;
const { RangePicker } = DatePicker;

const WithdrawalDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [pageSize, setPageSize] = useState(20);
  const [pageNo, setPageNo] = useState(1);
  const [dates, setDates] = useState();
  const defaultDates = [dayjs().subtract(7, "day"), dayjs()];
  const [isModalVisible, setModalVisible] = useState(false);
  const [statusModelVisible, setStatusModelVisible] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [userToUpdate, setUserToUpdate] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState(null);
  const [editCommentToUpdate, setEditCommentToUpdate] = useState(null);



  const { withdrawalsDetails, isLoading } = useSelector((state) => state.advanceStatistics);
  const {idToken} = useSelector((state) => state.auth);

  useEffect(() => {
    let query = `?page=${pageNo || 1}&page_size=${pageSize || 20}`;

    if (searchText) {
      query = query + `&search=${searchText}`;
    }
 
    dispatch(fetchWithdrawalsDetails({idToken, query}));
    console.log(query)
  }, [dispatch, idToken, pageNo, pageSize , searchText]);



  const columns = [
    {
      title: 'Login ID',
      dataIndex: 'login_id',
      key: 'login_id',
      width: 120,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (text) => text || '-', // Handle null or undefined values
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
    },
    {
      title: 'Plan',
      dataIndex: 'plan',
      key: 'plan',
      width: 150,
      render: (text) => `$${text.toFixed(2)}`, // Format as currency
    },
    {
      title: 'Starting Balance',
      dataIndex: 'starting_balance',
      key: 'starting_balance',
      width: 150,
      render: (text) => `$${text.toFixed(2)}`, // Format as currency
    },
    {
      title: 'Current Balance',
      dataIndex: 'current_balance',
      key: 'current_balance',
      width: 150,
      render: (text) => `$${text.toFixed(2)}`, // Format as currency
    },
    {
      title: 'Current Equity',
      dataIndex: 'current_equity',
      key: 'current_equity',
      width: 150,
      render: (text) => `$${text.toFixed(2)}`, // Format as currency
    },
    {
      title: 'Profit Share',
      dataIndex: 'profit_share',
      key: 'profit_share',
      width: 120,
      render: (text) => `${text}%`, // Format as percentage
    },
    {
      title: 'Profit',
      dataIndex: 'profit',
      key: 'profit',
      width: 150,
      render: (text) => `$${text.toFixed(2)}`, // Format as currency
    },
    {
      title: 'Bonus',
      dataIndex: 'bonus',
      key: 'bonus',
      width: 120,
      render: (text) => `$${text.toFixed(2)}`, // Format as currency
    },
    {
      title: 'Withdraw Profit',
      dataIndex: 'withdraw_profit',
      key: 'withdraw_profit',
      width: 150,
      render: (text) => `$${text.toFixed(2)}`, // Format as currency
    },
    {
      title: 'Verification Type',
      dataIndex: 'verification_type',
      key: 'verification_type',
      width: 150,
    },
    {
      title: 'Start Date',
      dataIndex: 'start_date',
      key: 'start_date',
      width: 200,
      render: (text) => new Date(text).toLocaleDateString(), // Format date
    },
    {
      title: 'Next Payout Date',
      dataIndex: 'next_payout_date',
      key: 'next_payout_date',
      width: 200,
      render: (text) => new Date(text).toLocaleDateString(), // Format date
    },
  ];
  
  

  const statusMenu = (key, record) => (
    <Menu onClick={(e) => openStatusUpdateModal(e.key, record)}>
      <Menu.Item key="New">New</Menu.Item>
      <Menu.Item key="Approved">Approved</Menu.Item>
      <Menu.Item key="In Progress">In Progress</Menu.Item>
      <Menu.Item key="Rejected">Rejected</Menu.Item>
      <Menu.Item key="Flagged">Flagged</Menu.Item>
      <Menu.Item key="Dismissed">Dismissed</Menu.Item>
    </Menu>
  );

  const handleUpdateStatus = () => {
    console.log(userToUpdate, updatedStatus);
    setStatusModelVisible(false);
  };

  const openStatusUpdateModal = (updatedValue, record) => {
    setUserToUpdate(record);
    setUpdatedStatus(updatedValue);
    setStatusModelVisible(true);
    setModalAction("Update Status");
  };

  const handleSearch = (value) => {
    setPageNo(1);
    setPageSize(20);
    setSearchText(value);
  };

  const handleTabChange = (value) => {
    setPageNo(1);
    setActiveTab(value);
  };

  const handleCategoryChange = (value) => {
    setPageNo(1);
    setCategory(value);
  };

  function triggerChange(page, updatedPageSize) {
    setPageNo(page);
    setPageSize(updatedPageSize);
  }

  function updateDateRange(dates) {
    setPageNo(1);
    if (dates) {
      setDates(dates.map((date) => date.format("DD MMM YYYY")));
    } else {
      setDates(null);
    }
  }

  const rangePresets = [
    { label: "Last 1 month", value: [dayjs().subtract(1, "month"), dayjs()] },
    { label: "Last 3 months", value: [dayjs().subtract(3, "months"), dayjs()] },
    { label: "Last 6 months", value: [dayjs().subtract(6, "months"), dayjs()] },
    { label: "Last 1 year", value: [dayjs().subtract(1, "year"), dayjs()] },
    { label: "All time", value: [dayjs().subtract(20, "years"), dayjs()] },
  ];

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleExport = () => {
    if (dates.length === 2) {
      const [startDate, endDate] = dates;
      const url = `withdrawals/details/export/?start_date=${startDate}&end_date=${endDate}`;
      
      dispatch(exportDataReq({ idToken, url }))
        .unwrap()
        .then((response) => {
          const { s3_file_url, filename } = response;
  
          const link = document.createElement('a');
          link.href = s3_file_url;
          link.download = filename; 
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
  
         dispatch(returnMessages("Export Successful" , 200))
  
          handleCloseModal();
        })
        .catch((error) => {
          dispatch(returnErrors("Export failed" , 400))

        });
    } else {
      notification.warning({
        message: "Invalid Dates",
        description: "Please select a valid date range.",
      });
    }
  };
  const handleDateChange = (values) => {
    if (values) {
      setDates(values);
    }
  };

  return (
    <div className="withdrawal_status_container">
      <div className="table_header_filter">
        <div className="header_left">
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
       
        </div>
        <div className="export_btn">
          <Button onClick={handleOpenModal}>
            <img
              src={exportBtnIcon}
              alt="export_btn_icon"
            />
            Export
          </Button>
          <Link className="link"
            to={"/advance-statistics/withdrawal-details/export-history"}
          >
            View Export History
          </Link>
        </div>
      </div>
      {isLoading ? (
        <LoaderOverlay />
      ) : (
        <AntTable
          data={withdrawalsDetails?.results}
          columns={columns}
          totalPages={Math.ceil(withdrawalsDetails?.count / pageSize)}
          totalItems={withdrawalsDetails?.count}
          pageSize={pageSize}
          CurrentPageNo={pageNo}
          setPageSize={setPageSize}
          triggerChange={triggerChange}
        />
      )}
      <Modal
      title="Export"
      visible={isModalVisible}
      onCancel={handleCloseModal} 
      footer={null} 
      className="export_modal" 
      closeIcon={<CloseOutlined style={{ color: '#fff' }} />} 
    >
      <div className="export_modal_wrapper">
        <RangePicker
          onChange={updateDateRange}
          autoFocus
          presets={rangePresets}
          style={{ width: '100%' }} 
        />
      </div>
      <p style={{ color: '#fff' }}>File will contain information of the date you’ve selected.</p>
      <div className="btn_wrapper">
        <Button
          type="primary"
          onClick={handleExport}
          style={{
            backgroundColor: '#1890ff', 
            borderColor: '#1890ff',
            color: '#fff',
          }}
        >
          Export
        </Button>
      </div>
    </Modal>
    </div>
  );
};

export default WithdrawalDetails;
