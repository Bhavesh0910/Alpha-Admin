import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Payout.scss";
import ArrowUpGreen from "../../../assets/icons/upArrowGreen.svg";
import exportIcon from "../../../assets/icons/export_btn_icon.svg";
import { Link, useNavigate } from "react-router-dom";
import LoaderOverlay from "../../../ReusableComponents/LoaderOverlay";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchPayoutDetails, fetchTotalMethod, fetchTotalPayments } from "../../../store/NewReducers/advanceStatistics";
import { Button, DatePicker, Modal, notification, Spin } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { returnMessages } from "../../../store/reducers/message";
import { exportDataReq } from "../../../store/NewReducers/exportSlice";
import { returnErrors } from "../../../store/reducers/error";
import dayjs from "dayjs";
import SplitChart from "./SplitChart";
import { dollarUS, formatCurrency, formatValue } from "../../../utils/helpers/string";
import GreenArrowIcon from '../../../assets/icons/green-arrow.svg'
import RedArrowIcon from '../../../assets/icons/red-arrow.svg'

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
  // const [isLoading, setIsLoading] = useState(true);

  const { payoutDetails, totalPayments, totalMethod, isTotalMethodLoading , isLoading  } = useSelector((state) => state.advanceStatistics);
  const { idToken } = useSelector((state) => state.auth);
  const { isLoading: isExportLoading } = useSelector((state) => state.export);

  const [defaultDates, setDefaultDates] = useState();

  const [isValidRange, setIsValidRange] = useState(true);
  const [lastValidRange, setLastValidRange] = useState({ startDate: null, endDate: null });

  const dispatch = useDispatch();
  const navigate = useNavigate();


  useEffect(() => {
    const fetchData = async () => {
      let query = `?page=${pageNo}&page_size=${pageSize}`;

      if (searchText) {
        query += `&search=${searchText}`;
      }

      try {
        await Promise.all([
          dispatch(fetchPayoutDetails({ idToken, query })),
          dispatch(fetchTotalPayments({ idToken, query })),
          dispatch(fetchTotalMethod({ idToken, query })),
        ]);
      } catch (error) {
        notification.error({
          message: "Data Fetch Error",
          description: "There was an error fetching data. Please try again.",
        });
      } finally {
      }
    };

    fetchData();
  }, [dispatch, idToken, pageNo, pageSize, searchText]);

  useEffect(() => {
    const fetchFilteredPayoutDetails = async () => {
      if (dates && dates.length === 2) {
        const startDate = dates[0]?.format("DD/MMM/YYYY");
        const endDate = dates[1]?.format("DD/MMM/YYYY");
        const query = `?start_date=${startDate}&end_date=${endDate}&page=${pageNo}&page_size=${pageSize}`;
        try {
          await dispatch(fetchPayoutDetails({ idToken, query }));
        } catch (error) {
          notification.error({
            message: "Data Fetch Error",
            description: "There was an error fetching payout details. Please try again.",
          });
        }
      }
    };

    fetchFilteredPayoutDetails();
  }, [dispatch, idToken, dates, pageNo, pageSize]);


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

          const link = document.createElement("a");
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

  const columns = useMemo(() => [
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
      render: (text) => dayjs(text)?.format("DD-MMM-YYYY") || "-",
    },
    {
      title: "Next Payout Date",
      dataIndex: "next_payout_date",
      key: "next_payout_date",
      render: (text) => dayjs(text)?.format("DD-MMM-YYYY") || "-",
    },
  ]);

  const updateExportDateRange = (dates) => {
    setPageNo(1);
    if (dates) {
      setExportDates(dates.map((date) => date?.format("DD/MMM/YYYY")));
    } else {
      setExportDates([]);
    }
  };

  const updateDateRange = (dates) => {
    setPageNo(1);

    if (dates && dates.length === 2) {
      const [startDate, endDate] = dates;
      const dayAfterTomorrow = dayjs().add(2, "day");

      if (endDate.isAfter(dayAfterTomorrow) || startDate.isAfter(dayAfterTomorrow)) {
        notification.error({
          message: 'Invalid Date Range',
          description: `The selected date range (${startDate.format("DD/MMM/YYYY")} - ${endDate.format("DD/MMM/YYYY")}) contains future dates. Please select a valid range.`,
        });

        if (lastValidRange) {
          setDefaultDates([lastValidRange.startDate, lastValidRange.endDate]);
          return;
        }

        setDefaultDates(null);
        setIsValidRange(false);
        return;
      }

      setDates(dates);
      setLastValidRange({ startDate, endDate });
      setDefaultDates(dates);
      setIsValidRange(true);
    } else {
      setDates(null);
      setDefaultDates(null);
    }
  };

  const handleExpectedTomorrowClick = () => {
    const today = dayjs();
    const tomorrow = dayjs().add(1, "day");
    updateDateRange([today, tomorrow]);
  };


  const currentDate = dayjs().format('YYYY-MM-DD');
let currentDateData = totalPayments?.find(item => item.payout_date === currentDate);

if (!currentDateData && totalPayments?.length) {
  const latestDate = totalPayments.reduce((latest, item) => {
    return dayjs(item.payout_date).isAfter(dayjs(latest.payout_date)) ? item : latest;
  });
  currentDateData = latestDate;
}

  const formatValue = (value) => {
    return value ? value.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '-';
  };

  return (
    <>
      {/* {isExportLoading && <LoaderOverlay />} */}
      {isLoading ?
        <LoaderOverlay />
        :
        <div className="payout_main">

          <div className="payout_header">
            <h2>Payout</h2>
            <div className="payout_header_right">
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
              <RangePicker
                presets={rangePresets}
                value={defaultDates}
                onChange={updateDateRange}
              />
            </div>
          </div>
          <div className="payout_lower_heading">
            <div className="payout_infobox_wrapper">
              {currentDateData && (
                <>
                  <div className="payout_lower_heading_left">
                    <h3>Total number of payouts requested</h3>
                    <div className="payout_lower_heading_inner">
                      <h2>
                        {formatValue(currentDateData.number_of_payouts_requested)}
                        <span className={currentDateData.percent_number_of_payouts_requested >= 0 ? 'green' : 'red'}>
                          {` (${currentDateData.percent_number_of_payouts_requested}%)`}
                          {currentDateData.percent_number_of_payouts_requested >= 0 ? (
                            <img src={GreenArrowIcon} alt="Increase" />
                          ) : (
                            <img src={RedArrowIcon} alt="Decrease" />
                          )}
                        </span>
                      </h2>
                    </div>
                  </div>

                  <div className="payout_lower_heading_left">
                    <h3>Total amount of payout requested</h3>
                    <div className="payout_lower_heading_inner">
                      <h2>
                        {dollarUS(currentDateData.amount_of_payout_requested)}
                        <span className={currentDateData.percent_amount_of_payout_requested >= 0 ? 'green' : 'red'}>
                          {` (${currentDateData.percent_amount_of_payout_requested}%)`}
                          {currentDateData.percent_amount_of_payout_requested >= 0 ? (
                            <img src={GreenArrowIcon} alt="Increase" />
                          ) : (
                            <img src={RedArrowIcon} alt="Decrease" />
                          )}
                        </span>
                      </h2>
                    </div>
                  </div>

                  <div className="payout_lower_heading_left">
                    <h3>Total amount of payout approved</h3>
                    <div className="payout_lower_heading_inner">
                      <h2>
                        {dollarUS(currentDateData.amount_of_payout_approved)}
                        <span className={currentDateData.percent_amount_of_payout_approved >= 0 ? 'green' : 'red'}>
                          {` (${currentDateData.percent_amount_of_payout_approved}%)`}
                          {currentDateData.percent_amount_of_payout_approved >= 0 ? (
                            <img src={GreenArrowIcon} alt="Increase" />
                          ) : (
                            <img src={RedArrowIcon} alt="Decrease" />
                          )}
                        </span>
                      </h2>
                    </div>
                  </div>

                  <div className="payout_lower_heading_left">
                    <h3>Total amount of payout flagged</h3>
                    <div className="payout_lower_heading_inner">
                      <h2>
                        {dollarUS(currentDateData.amount_of_payout_flagged)}
                        <span className={currentDateData.percent_amount_of_payout_flagged >= 0 ? 'green' : 'red'}>
                          {` (${currentDateData.percent_amount_of_payout_flagged}%)`}
                          {currentDateData.percent_amount_of_payout_flagged >= 0 ? (
                            <img src={GreenArrowIcon} alt="Increase" />
                          ) : (
                            <img src={RedArrowIcon} alt="Decrease" />
                          )}
                        </span>
                      </h2>
                    </div>
                  </div>

                  <div className="payout_lower_heading_left">
                    <h3>Total amount of payout rejected</h3>
                    <div className="payout_lower_heading_inner">
                      <h2>
                        {dollarUS(currentDateData.amount_of_payout_rejected)}
                        <span className={currentDateData.percent_amount_of_payout_rejected >= 0 ? 'green' : 'red'}>
                          {` (${currentDateData.percent_amount_of_payout_rejected}%)`}
                          {currentDateData.percent_amount_of_payout_rejected >= 0 ? (
                            <img src={GreenArrowIcon} alt="Increase" />
                          ) : (
                            <img src={RedArrowIcon} alt="Decrease" />
                          )}
                        </span>
                      </h2>
                    </div>
                  </div>
                </>
              )}





              {/* <div className="payout_lower_heading_left">
              <h3>
                Total New Payment Request <span>(Today)</span>
              </h3>
              <div className="payout_lower_heading_inner">
                <h2>{totalPayments && totalPayments[0]?.new_request}</h2>
              </div>
            </div>


            <div className="payout_lower_heading_left">
              <h3>
                Total New Payment Request <span>(Today)</span>
              </h3>
              <div className="payout_lower_heading_inner">
                <h2>{totalPayments && totalPayments[0]?.new_request}</h2>
              </div>
            </div>


            <div className="payout_lower_heading_left">
              <h3>
                Total New Payment Request <span>(Today)</span>
              </h3>
              <div className="payout_lower_heading_inner">
                <h2>{totalPayments && totalPayments[0]?.new_request}</h2>
              </div>
            </div> */}
            </div>


          </div>

          <SplitChart loading={isTotalMethodLoading} data={totalMethod} />



          <div className="payout_lower_heading_two">
            <div className="left">
              <h3>Eligible Payment List</h3>
            </div>
            <button
              style={{ cursor: "pointer" }}
              className="right"
              onClick={handleExpectedTomorrowClick}
            >
              Expected Tomorrow
            </button>
          </div>

          <div>

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

          </div>


          <Modal
            title="Export"
            visible={isModalVisible}
            onCancel={handleCloseModal}
            footer={null}
            className="export_modal"
            closeIcon={<CloseOutlined style={{ color: "#fff" }} />}
          >
            <div className="export_modal_wrapper">
              <RangePicker
                onChange={updateExportDateRange}
                autoFocus
                presets={rangePresets}
                style={{ width: "100%" }}
              />
            </div>
            <p style={{ color: "#fff" }}>File will contain information of the date you’ve selected.</p>
            <div className="btn_wrapper">
              <Button
                type="primary"
                onClick={handleExport}
                style={{
                  backgroundColor: "#1890ff",
                  borderColor: "#1890ff",
                  color: "#fff",
                }}
                loading={isExportLoading}
              >
                Export
              </Button>
            </div>
          </Modal>
        </div>
      }
    </>
  );
};

export default Payout;

const ExpandedRowRender = ({ record }) => {
  return (
    <div className="expanded-row-content">
      <p>
        <strong>Name:</strong> {record.name || "-"}
      </p>
      <p>
        <strong>Starting Balance:</strong> {record.starting_balance || "-"}
      </p>
      <p>
        <strong>Current Balance:</strong> {Number(record.current_balance).toFixed(2) || "-"}
      </p>
      <p>
        <strong>Current Equity:</strong> {Number(record.current_equity).toFixed(2) || "-"}
      </p>
    </div>
  );
};
