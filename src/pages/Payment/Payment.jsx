import React, {useEffect, useMemo, useState} from "react";
import "./Payment.scss";
import AntTable from "../../ReusableComponents/AntTable/AntTable";
import {DatePicker, Button, Select, Tooltip, notification, Card, Dropdown, Menu, Modal, Form, Input} from "antd";
import {Link, useNavigate} from "react-router-dom";
import searchIcon from "../../assets/icons/searchIcon.svg";
import editIcon from "../../assets/icons/edit_icon_gray.svg";
import exportBtnIcon from "../../assets/icons/export_btn_icon.svg";
import verifiedIcon from "../../assets/icons/verified_green_circleIcon.svg";
import notVerifiedIcon from "../../assets/icons/notverified_red_circleIcon.svg";
import {ReactComponent as CopyButton} from "../../assets/icons/copyButtonGray.svg";
import dayjs from "dayjs";
import {paymentExportsReq, paymentListReq, selectedEmail, updatePaymentStatusReq} from "../../store/NewReducers/payment";
import {useDispatch, useSelector} from "react-redux";
import moment from "moment";
import LoaderOverlay from "../../ReusableComponents/LoaderOverlay";
import {DownOutlined} from "@ant-design/icons";
const {Option} = Select;
const {RangePicker} = DatePicker;

const Payment = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const dispatch = useDispatch();
  const {idToken, searchDates} = useSelector((state) => state.auth);
  const {paymentData, isLoading} = useSelector((state) => state.payment);

  const [pageSize, setPageSize] = useState(20);
  const [pageNo, setPageNo] = useState(1);
  const [dates, setDates] = useState();
  const defaultDates = [dayjs().subtract(7, "day"), dayjs()];

  const [statusModelVisible, setStatusModelVisible] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [userToUpdate, setuserToUpdate] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState(null);

  const [editCommentToUpdate, setEditCommentToUpdate] = useState(null);

  const columns = useMemo(
    () => [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        width: 150,
        render: (text) => text,
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        width: 200,
        render: (text) => {
          return (
            <div
              onClick={() => {
                dispatch(selectedEmail(text));
                navigate("/payments/payments-export-history");
              }}
            >
              {text}
            </div>
          );
        },
      },
      {
        title: "Payment ID",
        dataIndex: "payment_id",
        key: "payment_id",
        width: 150,
        render: (text) => (
          <>
            {text ? (
              <div className="copy_text_btn">
                <a href={`mailto:${text}`}>{text}</a>
                <Tooltip title="Copy Payment ID">
                  <Button
                    icon={<CopyButton />}
                    size="small"
                    style={{marginLeft: 8}}
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
      {
        title: "Transaction ID",
        dataIndex: "transaction_id",
        key: "transaction_id",
        width: 200,
        render: (text) => (
          <>
            {text ? (
              <div className="copy_text_btn">
                <a href={`mailto:${text}`}>{text}</a>
                <Tooltip title="Copy Transaction ID">
                  <Button
                    icon={<CopyButton />}
                    size="small"
                    style={{marginLeft: 8}}
                    onClick={() => {
                      navigator.clipboard.writeText(text);
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
          </>
        ),
      },
      {
        title: "Payment Status",
        dataIndex: "payment_status",
        key: "payment_status",
        width: 150,
      },
      {
        title: "Payment Platform Status",
        dataIndex: "payment_platform_status",
        key: "payment_platform_status",
        width: 180,
      },
      {
        title: "Promo",
        dataIndex: "promo_code",
        key: "promo_code",
        width: 50,
        render: (text) => (
          <>
            {text ? (
              <div className="copy_text_btn">
                <a href={`mailto:${text}`}>{text}</a>
                <Tooltip title="Copy Promo">
                  <Button
                    icon={<CopyButton />}
                    size="small"
                    style={{marginLeft: 8}}
                    onClick={() => {
                      navigator.clipboard.writeText(text);
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
          </>
        ),
      },
      {
        title: "Amount",
        dataIndex: "amount",
        key: "amount",
        width: 150,
        render: (amount) => <span>{amount}</span>,
      },
      {
        title: "Date",
        dataIndex: "created_at",
        key: "created_at",
        width: 150,
        render: (text) => moment(text).format("YYYY-MM-DD"),
      },
      {
        title: "Login ID",
        dataIndex: "account_login_id",
        key: "account_login_id",
        width: 150,
      },
      {
        title: "Challenge",
        dataIndex: "challenge_name",
        key: "challenge_name",
        width: 150,
      },
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
                width: "120px",
                display: "flex",
                flexDirection: "row-reverse",
                justifyContent: "space-between",
                padding: "6px 10px",
              }}
            >
              <p className={text === "New" ? "new" : text === "In Progress" ? "in_progress" : text === "Approved" ? "approved" : text === "Failed" ? "failed" : text === "Pending" ? "pending" : ""}>
                {text}
              </p>
            </Button>
          </Dropdown>
        ),
      },
    ],
    [paymentData],
  );

  const statusMenu = (key, record) => (
    <Menu onClick={(e) => openStatusUpdateModal(e.key, record)}>
      <Menu.Item key="New">New</Menu.Item>
      <Menu.Item key="Approved">Approved</Menu.Item>
      <Menu.Item key="In Progress">In Progress</Menu.Item>
      <Menu.Item key="Rejected">Rejected</Menu.Item>
      <Menu.Item key="Flagged">Flagged</Menu.Item>
      <Menu.Item key="Dissmissed">Dissmissed</Menu.Item>
    </Menu>
  );

  const handleUpdateStatus = () => {
    let body = {payment_id: userToUpdate?.transaction_id};
    console.log(idToken)
    dispatch(updatePaymentStatusReq({idToken, body, dispatch}));
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
      query = query + `&start_date=${dates[0]}&end_date=${dates[1]}`;
    }

    dispatch(paymentListReq({idToken, query, dispatch}));
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

  function updateDateRange(dates) {
    setPageNo(1);
    if (dates) {
      setDates(dates.map((date) => date.format("DD MMM YYYY")));
    } else {
      setDates(null);
    }
  }

  const rangePresets = [
    {label: "Last 1 month", value: [dayjs().subtract(1, "month"), dayjs()]},
    {label: "Last 3 months", value: [dayjs().subtract(3, "months"), dayjs()]},
    {label: "Last 6 months", value: [dayjs().subtract(6, "months"), dayjs()]},
    {label: "Last 1 year", value: [dayjs().subtract(1, "year"), dayjs()]},
    {label: "All time", value: [dayjs().subtract(20, "years"), dayjs()]}, // Assuming "All time" covers a very long period
  ];

  const [isModalVisible, setModalVisible] = useState(false);

  const handleCloseModal = () => {
    setModalVisible(!isModalVisible);
  };
  return (
    <div className="payment_container">
      <div className="header_wrapper">
        <Button
          // onClick={() => navigate("payments-view-logs")}
          className="view_logs__btn standard_button"
        >
          View Logs
        </Button>
      </div>
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
            <RangePicker
              // placeholder={dates}
              //  defaultValue={defaultDates}
              onChange={updateDateRange}
              autoFocus
              presets={rangePresets}
            />
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
            style={{color: "white"}}
          >
            View Export History
          </Link>
        </div>
      </div>
      <Card className="table-wrapper">
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
          />
        )}
      </Card>

      {isModalVisible === true ? (
        <CalendarModal
          idToken={idToken}
          status={activeTab}
          handleCloseModal={handleCloseModal}
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

const CalendarModal = ({idToken, status, handleCloseModal}) => {
  const {exportLink} = useSelector((state) => state.payment);
  const {searchDates} = useSelector((state) => state.auth);
  const [dates, setdates] = useState(null);
  const onRangeChange = (selectedDates) => {
    setdates(selectedDates.map((value) => value.format("DD/MMM/YYYY")));
  };
  const dispatch = useDispatch();

  useEffect(() => {
    let query = `?start_date=${dates && dates[0]}&end_date=${dates && dates[1]}&status=${status === "all" ? "" : status === "paid" ? 1 : 0}`;
    if (dates) {
      dispatch(paymentExportsReq({idToken, query, dispatch}));
    }
  }, [dates]);

  useEffect(() => {
    if (exportLink) {
      handleCloseModal();
    }
  }, [exportLink]);

  const rangePresets = [
    {label: "Last 1 month", value: [dayjs().subtract(1, "month"), dayjs()]},
    {label: "Last 3 months", value: [dayjs().subtract(3, "months"), dayjs()]},
    {label: "Last 6 months", value: [dayjs().subtract(6, "months"), dayjs()]},
    {label: "Last 1 year", value: [dayjs().subtract(1, "year"), dayjs()]},
    {label: "All time", value: [dayjs().subtract(20, "years"), dayjs()]},
  ];

  const [placement, SetPlacement] = useState("bottomLeft");
  const placementChange = (e) => {
    SetPlacement(e.target.value);
  };

  return (
    <div
      className="calendarModal_container"
      onClick={handleCloseModal}
    >
      <div
        className="calendarModal_wrapper"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <h4>Export</h4>
        <div className="calendar_wrapper">
          <RangePicker
            // open={true}
            presets={rangePresets}
            onChange={onRangeChange}
            placement={placement}
          />
        </div>
        <p>File will contain information of the date you’ve selected.</p>
        <div className="calandarModal_export_btn">
          {exportLink != "" ? (
            <a
              href={`${exportLink}`}
              target="_blank"
            >
              <Button className="standard_button">Export</Button>
            </a>
          ) : (
            <Button className="standard_button">Export</Button>
          )}
        </div>
      </div>
    </div>
  );
};
