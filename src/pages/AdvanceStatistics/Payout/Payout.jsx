import React, { useEffect, useRef, useState } from "react";
import "./Payout.scss";
import ArrowUpGreen from "../../../assets/icons/upArrowGreen.svg";
import exportIcon from "../../../assets/icons/export_btn_icon.svg";
import { Link, useNavigate } from "react-router-dom";
import LoaderOverlay from "../../../ReusableComponents/LoaderOverlay";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchPayoutDetails, fetchTotalPayments } from "../../../store/NewReducers/advanceStatistics";
import moment from "moment";
import { Button, DatePicker, Modal, notification } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { returnMessages } from "../../../store/reducers/message";
import { exportDataReq } from "../../../store/NewReducers/exportSlice";
import { returnErrors } from "../../../store/reducers/error";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const Payout = () => {
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [category, setCategory] = useState("all");
  const [filterData, setFilterData] = useState([]);
  const [pageSize, setPageSize] = useState(20);
  const [pageNo, setPageNo] = useState(1);
  const [isModalVisible, setModalVisible] = useState(false);
  const [dates, setDates] = useState(null);
  const [exportDates, setExportDates] = useState(null);

  const { payoutDetails, totalPayments, isLoading } = useSelector((state) => state.advanceStatistics);
  const { idToken } = useSelector((state) => state.auth);
  const { isLoading: isExportLoading } = useSelector((state) => state.export);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    let query = `?page=${pageNo || 1}&page_size=${pageSize || 20}`;

    if (searchText) {
      query = query + `&search=${searchText}`;
    }

    if (dates && dates.length === 2) {
      const [startDate, endDate] = dates;
      query += `&start_date=${startDate}&end_date=${endDate}`;
    }

    dispatch(fetchPayoutDetails({ idToken, query }));
    dispatch(fetchTotalPayments({ idToken, query }));
  }, [dispatch, idToken, pageNo, pageSize, searchText, dates]);

  const searchRef = useRef();

  function triggerChange(page, updatedPageSize) {
    setPageNo(page);
    setPageSize(updatedPageSize);
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
  console.log("isExportLoading:", isExportLoading);


  const handleExport = () => {
    if (exportDates && exportDates.length === 2) {
      const [startDate, endDate] = exportDates;
      const url = `export/payout-details/?start_date=${startDate}&end_date=${endDate}`;

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

          dispatch(returnMessages("Export Successful", 200));
          handleCloseModal();
        })
        .catch((error) => {
          dispatch(returnErrors("Export failed", 400));
        });
    } else {
      notification.warning({
        message: "Invalid Dates",
        description: "Please select a valid date range.",
      });
    }
  };

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
      title: "Profit Share",
      dataIndex: "profit_share",
      key: "profit_share",
      width: 70,
      render: (text) => text || "-",
    },
    {
      title: "Profit",
      dataIndex: "profit",
      key: "profit",
      width: 70,
      render: (text) => Number(text).toFixed(2) || "-",
    },
    {
      title: "Bonus",
      dataIndex: "bonus",
      key: "bonus",
      width: 70,
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
      render: (text) => moment(text).format("DD-MMM-YYYY") || "-",
    },
    {
      title: "Next Payout Date",
      dataIndex: "next_payout_date",
      key: "next_payout_date",
      render: (text) => moment(text).format("DD-MMM-YYYY") || "-",
    },
  ];

  const updateExportDateRange = (dates) => {
    setPageNo(1);
    if (dates) {
      setExportDates(dates.map(date => date.format("DD/MMM/YYYY")));
    } else {
      setExportDates([]);
    }
  };

  const updateDateRange = (dates) => {
    setPageNo(1);
    if (dates) {
      setDates(dates.map(date => date.format("DD/MMM/YYYY")));
    } else {
      setDates([]);
    }
  };

  const handleExpectedTomorrowClick = () => {
    const today = dayjs();
    const tomorrow = dayjs().add(1, 'day');
    updateDateRange([today, tomorrow]);
  };

  return (
    <>
    {/* {isExportLoading && <LoaderOverlay />} */}
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
              <h2>{totalPayments && totalPayments[0]?.new_request}</h2>
            </div>
          </div>
    
          <div className="export_btn">
            <Button onClick={handleOpenModal}>
              <img
                src={exportIcon}
                alt="export_btn_icon"
              />
              Export
            </Button>
            <Link
              className="link"
              to={"/advance-statistics/payout-export-history"}
            >
              View Export History
            </Link>
          </div>
        </div>

        <RangePicker
          presets={rangePresets}
          onChange={updateDateRange}
        />
        <div className="payout_lower_heading_two">
          <div className="left">
            <h3>Eligible Payment List</h3>
          </div>
          <button style={{cursor:'pointer'}} className="right" onClick={handleExpectedTomorrowClick}>
            Expected Tomorrow
          </button>
        </div>

        <div>
          {isLoading ? (
            <LoaderOverlay />
          ) : (
            <AntTable
              data={payoutDetails?.results || []}
              columns={columns}
              totalPages={Math.ceil(payoutDetails?.count / pageSize)}
              totalItems={payoutDetails?.count}
              pageSize={pageSize}
              CurrentPageNo={pageNo}
              setPageSize={setPageSize}
              triggerChange={triggerChange}
              isExpandable={true}
              ExpandedComp={ExpandedRowRender}
              rowId="login_id"
              scrollY={420}
            />
          )}
        </div>

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
              onChange={updateExportDateRange}
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
              loading={isExportLoading}

            >
              Export
            </Button>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Payout;

const ExpandedRowRender = ({ record }) => {
  return (
    <div className="expanded-row-content">
      <p><strong>Name:</strong> {record.name || '-'}</p>
      <p><strong>Starting Balance:</strong> {record.starting_balance || '-'}</p>
      <p><strong>Current Balance:</strong> {Number(record.current_balance).toFixed(2) || '-'}</p>
      <p><strong>Current Equity:</strong> {Number(record.current_equity).toFixed(2) || '-'}</p>
    </div>
  );
};
