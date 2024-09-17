import React, { useEffect, useMemo, useState } from "react";
import "./Payment.scss";
import AntTable from "../../ReusableComponents/AntTable/AntTable";
import { DatePicker, Button, Select, Tooltip, notification, Card, Dropdown, Menu, Modal, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import searchIcon from "../../assets/icons/searchIcon.svg";
import editIcon from "../../assets/icons/edit_icon_gray.svg";
import exportBtnIcon from "../../assets/icons/export_btn_icon.svg";
import verifiedIcon from "../../assets/icons/verified_green_circleIcon.svg";
import notVerifiedIcon from "../../assets/icons/notverified_red_circleIcon.svg";
import { ReactComponent as CopyButton } from "../../assets/icons/copyButtonGray.svg";
import dayjs from "dayjs";
import { paymentExportsReq, paymentListReq, selectedEmail, updatePaymentStatusReq } from "../../store/NewReducers/payment";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import LoaderOverlay from "../../ReusableComponents/LoaderOverlay";
import { DownOutlined } from "@ant-design/icons";
import { returnErrors } from "../../store/reducers/error";
import { returnMessages } from "../../store/reducers/message";
const { Option } = Select;
const { RangePicker } = DatePicker;

const Payment = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const dispatch = useDispatch();
  const { idToken, searchDates } = useSelector((state) => state.auth);
  const { paymentData, isLoading } = useSelector((state) => state.payment);

  const [pageSize, setPageSize] = useState(20);
  const [pageNo, setPageNo] = useState(1);
  const [dates, setDates] = useState();

  const [statusModelVisible, setStatusModelVisible] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [userToUpdate, setuserToUpdate] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState(null);

  const [editCommentToUpdate, setEditCommentToUpdate] = useState(null);

  const [defaultDates, setDefaultDates] = useState();

  const [isValidRange, setIsValidRange] = useState(true);
  const [lastValidRange, setLastValidRange] = useState({ startDate: null, endDate: null});

  const columns = useMemo(
    () => [
      // {
      //   title: "Name",
      //   dataIndex: "name",
      //   key: "name",
      //   width: 150,
      //   render: (text) => text,
      // },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        width: 150,
        render: (text) => {
          return (
            <div className="copy_text_btn">
              {text ? (
                <>
                  <a href={`mailto:${text}`}>{text}</a>
                  <Tooltip title="Copy Email">
                    <Button
                      icon={<CopyButton />}
                      size="small"
                      style={{ marginLeft: 8 }}
                      onClick={() => {
                        navigator.clipboard.writeText(text);
                        notification.success({
                          message: "Email copied to clipboard",
                          placement: "topRight",
                        });
                      }}
                      className="copy_btn"
                    />
                  </Tooltip>
                </>
              ) : (
                "-"
              )}
            </div>
          );
        },
      },
      {
        title: "Payment ID",
        dataIndex: "payment_id",
        key: "payment_id",
        width: 100,
        render: (text) => (
          <>
            {text ? (
              <div className="copy_text_btn">
                <a href={`mailto:${text}`}>{text}</a>
                <Tooltip title="Copy Payment ID">
                  <Button
                    icon={<CopyButton />}
                    size="small"
                    style={{ marginLeft: 8 }}
                    onClick={() => {
                      navigator.clipboard.writeText(text);
                      notification.success({
                        message: "Payment ID copied to clipboard",
                        placement: "topRight",
                      });
                    }}
                    className="copy_btn"
                  />
                </Tooltip>
              </div>
            ) : (
              "-"
            )}
          </>
        ),
      },
      // {
      //   title: "Transaction ID",
      //   dataIndex: "transaction_id",
      //   key: "transaction_id",
      //   width: 200,
      //   render: (text) => (
      //     <>
      //       {text ? (
      //         <div className="copy_text_btn">
      //           <a href={`mailto:${text}`}>{text}</a>
      //           <Tooltip title="Copy Transaction ID">
      //             <Button
      //               icon={<CopyButton />}
      //               size="small"
      //               style={{marginLeft: 8}}
      //               onClick={() => {
      //                 navigator.clipboard.writeText(text);
      //                 notification.success({
      //                   message: "Transaction ID copied to clipboard",
      //                   placement: "topRight",
      //                 });
      //               }}
      //               className="copy_btn"
      //             />
      //           </Tooltip>
      //         </div>
      //       ) : (
      //         "-"
      //       )}
      //     </>
      //   ),
      // },
      {
        title: "Payment Status",
        dataIndex: "payment_status",
        key: "payment_status",
        width: 120,
      },
      {
        title: "Payment Platform Status",
        dataIndex: "payment_platform_status",
        key: "payment_platform_status",
        width: 180,
      },
      // {
      //   title: "Promo",
      //   dataIndex: "promo_code",
      //   key: "promo_code",
      //   width: 50,
      //   render: (text) => (
      //     <>
      //       {text ? (
      //         <div className="copy_text_btn">
      //           <a href={`mailto:${text}`}>{text}</a>
      //           <Tooltip title="Copy Promo">
      //             <Button
      //               icon={<CopyButton />}
      //               size="small"
      //               style={{marginLeft: 8}}
      //               onClick={() => {
      //                 navigator.clipboard.writeText(text);
      //                 notification.success({
      //                   message: "Promo copied to clipboard",
      //                   placement: "topRight",
      //                 });
      //               }}
      //               className="copy_btn"
      //             />
      //           </Tooltip>
      //         </div>
      //       ) : (
      //         "-"
      //       )}
      //     </>
      //   ),
      // },
      {
        title: "Amount",
        dataIndex: "amount",
        key: "amount",
        width: 150,
        render: (amount) => <span>{amount ? `$${amount}` : "-"}</span>,
      },
      // {
      //   title: "Date",
      //   dataIndex: "created_at",
      //   key: "created_at",
      //   width: 150,
      //   render: (text) => moment(text).format("YYYY-MM-DD"),
      // },
      {
        title: "Login ID",
        dataIndex: "account_login_id",
        key: "account_login_id",
        width: 150,
      },
      // {
      //   title: "Challenge",
      //   dataIndex: "challenge_name",
      //   key: "challenge_name",
      //   width: 150,
      // },
      {
        title: "Status",
        dataIndex: "payment_status",
        key: "payment_status",
        render: (text, record, index) => (
          <Dropdown
            overlay={() => statusMenu(text, record)}
            trigger={["click"]}
          >
            <Button
              icon={<DownOutlined />}
              className="status_button"
              style={{
                width: "160px",
                display: "flex",
                flexDirection: "row-reverse",
                justifyContent: "space-between",
                padding: "6px 10px",
              }}
            >
              <p className={text === "New" ? "new" : text === "In Progress" ? "in_progress" : text === "Approved" ? "approved" : text === "Failed" ? "failed" : text === "Pending" ? "Pending" : ""}>
                {text?.slice(0, 1).toUpperCase() + text?.slice(1, text?.length) || "-"}
              </p>
            </Button>
          </Dropdown>
        ),
      },
    ],
    [paymentData],
  );

  const statusMenu = (key, record) => (
    <Menu
      className="menuCard"
      onClick={(e) => openStatusUpdateModal(e.key, record)}
    >
      <Menu.Item key="New">New</Menu.Item>
      <Menu.Item key="Approved">Approved</Menu.Item>
      <Menu.Item key="In Progress">In Progress</Menu.Item>
      <Menu.Item key="Rejected">Rejected</Menu.Item>
      <Menu.Item key="Flagged">Flagged</Menu.Item>
      <Menu.Item key="Dissmissed">Dissmissed</Menu.Item>
    </Menu>
  );

  const handleUpdateStatus = () => {
    let body = { payment_id: userToUpdate?.transaction_id };
    console.log(idToken);
    dispatch(updatePaymentStatusReq({ idToken, body, dispatch }));
    setStatusModelVisible(false);
  };

  const openStatusUpdateModal = (updatedValue, record) => {
    console.log(updatedValue, record);
    setuserToUpdate(record);
    setUpdatedStatus(updatedValue);
    setStatusModelVisible(true);
    setModalAction("Update Status");
  };

  useEffect(() => {
    fetchPayments(idToken, pageSize, pageNo, searchText, activeTab, dates);
  }, [idToken, pageSize, pageNo, searchText, activeTab, dates]);

  function fetchPayments(idToken, pageSize, pageNo, searchText, activeTab, dates) {
    let query = `?page=${pageNo || 1}&page_size=${pageSize || 20}&status=${activeTab === "paid" ? 1 : activeTab === "unpaid" ? 0 : ""}`;

    if (searchText) {
      query = query + `&search=${searchText}`;
    }
    if (dates) {
      let startDate = dates[0]?.format("DD/MMM/YYYY")
      let endDate = dates[1]?.format("DD/MMM/YYYY")
      query = query + `&start_date=${startDate}&end_date=${endDate}`;
    }

    dispatch(paymentListReq({ idToken, query, dispatch }));
  }

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

  const updateDateRange = (dates) => {
    setPageNo(1);

    if (dates && dates.length === 2) {
      const [startDate, endDate] = dates;

      if (endDate.isAfter(dayjs()) || startDate.isAfter(dayjs())) {
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



  const rangePresets = [
    { label: "Last 1 month", value: [dayjs().subtract(1, "month"), dayjs()] },
    { label: "Last 3 months", value: [dayjs().subtract(3, "months"), dayjs()] },
    { label: "Last 6 months", value: [dayjs().subtract(6, "months"), dayjs()] },
    { label: "Last 1 year", value: [dayjs().subtract(1, "year"), dayjs()] },
    { label: "All time", value: [dayjs().subtract(20, "years"), dayjs()] }, // Assuming "All time" covers a very long period
  ];

  const [isModalVisible, setModalVisible] = useState(false);

  const handleCloseModal = () => {
    setModalVisible(true);
  };
  const { exportLink } = useSelector((state) => state.payment);

  return (
    <div className="payment_container">
      <div className="header_wrapper">
        <Button
          onClick={() => navigate("/payments/payments-view-logs")}
          className="view_logs__btn standard_button"
        >
          View Logs
        </Button>
      </div>
      <div className="table_header_filter">
        <div className="header_left">
          <div className="search_box_wrapper">
            {/* <Select
              className="category_dropdown"
              defaultValue="all"
              onChange={handleCategoryChange}
            >
              <Option value="all">All Categories</Option>
         
            </Select> */}
            <input
              placeholder="Search by Email , Payment Id..."
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
          <div className="header_middle">
            <div className="filter_buttons">
              <Button
                className={activeTab === "all" ? "active" : ""}
                onClick={() => handleTabChange("all")}
              >
                All
              </Button>
              <Button
                className={activeTab === "paid" ? "active" : ""}
                onClick={() => handleTabChange("paid")}
              >
                Paid
              </Button>
              <Button
                className={activeTab === "unpaid" ? "active" : ""}
                onClick={() => handleTabChange("unpaid")}
              >
                Unpaid
              </Button>
            </div>
            <div className="paymentDateRange">
              <RangePicker
                value={defaultDates}
                onChange={updateDateRange}
                presets={rangePresets}
              />
            </div>
          </div>
        </div>
        <div className="export_btn">
          <Button onClick={handleCloseModal}>
            <img
              src={exportBtnIcon}
              alt="export_btn_icon"
            />
            Export
          </Button>
          <Link
            to={"/payments/payments-export-history"}
            style={{ color: "white" }}
          >
            View Export History
          </Link>
        </div>
      </div>
      <div className="table-wrapper">
        {isLoading ? (
          <LoaderOverlay />
        ) : (
          <AntTable
            // data={paymentData?.data || []}
            data={paymentData?.results || paymentData || []}
            columns={columns}
            totalPages={Math.ceil(paymentData?.count / pageSize)}
            totalItems={paymentData?.count}
            pageSize={pageSize}
            CurrentPageNo={pageNo}
            setPageSize={setPageSize}
            triggerChange={triggerChange}
            isExpandable={true}
            ExpandedComp={ExpandableRow}
            rowId={"id"}
          />
        )}
      </div>

      {isModalVisible === true ? (
        <CalendarModal
          idToken={idToken}
          status={activeTab}
          setModalVisible={setModalVisible}
          handleCloseModal={handleCloseModal}
          exportLink={exportLink}
        />
      ) : (
        ""
      )}
      <Modal
        title={modalAction}
        open={statusModelVisible}
        onCancel={() => {
          setStatusModelVisible(false);
          setEditCommentToUpdate(null);
          setuserToUpdate(null);
        }}
        onOk={handleUpdateStatus}
      >
        <Form.Item
          label="Comment"
          value={editCommentToUpdate}
          onChange={(e) => setEditCommentToUpdate(e.target.value)}
        >
          <Input.TextArea placeholder="Write your comment here.." />
        </Form.Item>
      </Modal>
    </div>
  );
};

export default Payment;

const CalendarModal = ({ idToken, exportLink, status, handleCloseModal, setModalVisible }) => {
  const dispatch = useDispatch();

  const [dates, setDates] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const rangePresets = [
    { label: "Last 1 month", value: [dayjs().subtract(1, "month"), dayjs()] },
    { label: "Last 3 months", value: [dayjs().subtract(3, "months"), dayjs()] },
    { label: "Last 6 months", value: [dayjs().subtract(6, "months"), dayjs()] },
    { label: "Last 1 year", value: [dayjs().subtract(1, "year"), dayjs()] },
    { label: "All time", value: [dayjs().subtract(20, "years"), dayjs()] },
  ];

  const onRangeChange = (dates) => {
    // setPageNo(1);
    if (dates) {
      setDates(dates.map((date) => date.format("DD/MMM/YYYY")));
      console.log(dates);
    } else {
      setDates([]);
    }
  };

  const handleExport = () => {
    if (dates && dates?.length === 2) {
      const [startDate, endDate] = dates;
      let query = `?start_date=${startDate}&end_date=${endDate}&status=${status === "all" ? "" : status === "paid" ? 1 : 0}`;

      dispatch(paymentExportsReq({ idToken, query, dispatch }))
        .unwrap()
        .then((response) => {
          const { s3_file_url, filename } = response;

          const link = document.createElement("a");
          link.href = s3_file_url;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setModalVisible(false);
          dispatch(returnMessages("Export Successful", 200));

          setModalVisible(false);
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

  useEffect(() => {
    if (exportLink) {
      handleCloseModal();
    }
  }, [exportLink]);

  return (
    <div
      className="calendarModal_container"
      onClick={() => setModalVisible(false)}
    >
      <div
        className="calendarModal_wrapper"
        onClick={(e) => e.stopPropagation()}
      >
        <h4>Export</h4>
        <div className="calendar_wrapper">
          <RangePicker
            presets={rangePresets}
            onChange={onRangeChange}
          />
        </div>
        <p>File will contain information for the dates you’ve selected.</p>
        <div className="calandarModal_export_btn">
          <Button
            className="standard_button"
            onClick={handleExport}
            loading={isLoading}
          >
            Export
          </Button>
        </div>
      </div>
    </div>
  );
};

export const ExpandableRow = ({ record }) => {
  return (
    <div className="paymentNestedTable">
      <div>
        <div>Name</div>
        <p>{record?.name || "-"}</p>
      </div>
      {/* 
      <div>
        <div>Amount</div>
        <p>{record.amount || "-"}</p>
      </div>
      <div>
        <div>Login id</div>
        <p>{record.account_login_id || "-"}</p>
      </div> */}
      <div>
        <div>Date</div>
        <p>{record?.created_at ? moment(record.created_at).format("YYYY-MM-DD") : "-"}</p>
      </div>
      <div>
        <div>Challenge</div>
        <p>{record?.challenge_name || "-"}</p>
      </div>
      <div>
        <div>Promo Code</div>
        <p>
          {record.promo_code ? (
            <div className="copy_text_btn">
              <a href={`mailto:${record.promo_code}`}>{record?.promo_code}</a>
              <Tooltip title="Copy Promo">
                <Button
                  icon={<CopyButton />}
                  size="small"
                  style={{ marginLeft: 8 }}
                  onClick={() => {
                    navigator.clipboard.writeText(record?.promo_code);
                    notification.success({
                      message: "Promo copied to clipboard",
                      placement: "topRight",
                    });
                  }}
                  className="copy_btn"
                />
              </Tooltip>
            </div>
          ) : (
            "-"
          )}
        </p>
      </div>
      <div>
        <div>Transaction ID</div>
        <p>
          {" "}
          {record.transaction_id ? (
            <div className="copy_text_btn">
              <a href={`mailto:${record.transaction_id}`}>{record?.transaction_id}</a>
              <Tooltip title="Copy Transaction ID">
                <Button
                  icon={<CopyButton />}
                  size="small"
                  style={{ marginLeft: 8 }}
                  onClick={() => {
                    navigator.clipboard.writeText(record?.transaction_id);
                    notification.success({
                      message: "Transaction ID copied to clipboard",
                      placement: "topRight",
                    });
                  }}
                  className="copy_btn"
                />
              </Tooltip>
            </div>
          ) : (
            "-"
          )}
        </p>
      </div>
    </div>
  );
};
