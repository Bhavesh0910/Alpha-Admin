import React, { useEffect, useMemo, useState } from "react";
import "./Payment.scss";
import AntTable from "../../ReusableComponents/AntTable/AntTable";
import { DatePicker, Button, Select, Tooltip, notification, Card } from "antd";
import { Link, useNavigate } from "react-router-dom";
import searchIcon from "../../assets/icons/searchIcon.svg";
import editIcon from "../../assets/icons/edit_icon_gray.svg";
import exportBtnIcon from "../../assets/icons/export_btn_icon.svg";
import verifiedIcon from "../../assets/icons/verified_green_circleIcon.svg";
import notVerifiedIcon from "../../assets/icons/notverified_red_circleIcon.svg";
import { ReactComponent as CopyButton } from "../../assets/icons/copyButtonGray.svg";
import dayjs from "dayjs";
import { paymentExportsReq, paymentListReq, selectedEmail } from "../../store/NewReducers/payment";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import LoaderOverlay from "../../ReusableComponents/LoaderOverlay";
const { Option } = Select;
const { RangePicker } = DatePicker;

const Payment = () => {

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const dispatch = useDispatch();
  const { idToken, searchDates } = useSelector(state => state.auth);
  const { paymentData, count, isLoading } = useSelector(state => state.payment);

  const [pageSize, setPageSize] = useState(20);
  const [pageNo, setPageNo] = useState(1);
  const [dates, setDates] = useState(searchDates);
  const defaultDates = [dayjs().subtract(7, 'day'), dayjs()];

  const columns = useMemo(() => [
    {
      title: "User",
      dataIndex: "user",
      key: "user",
    },
    {
      title: "Account",
      dataIndex: "account",
      key: "account",
    },
    {
      title: "Balance",
      dataIndex: "account_balance",
      key: "account_balance",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => moment(text?.created_at).format("YYYY-MM-DD")

    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => {
        return (
          <div onClick={() => {
            dispatch(selectedEmail(text));
            navigate("/payments/payments-export-history")
          }}>
            {text}
          </div>
          // <div onClick={() => {
          //   dispatch(selectedEmail(text));
          //   navigate("/payment/admin/payment-history/")
          // }}>
          //   {text}
          // </div>
        )
      }

    },
    {
      title: "Funding Evaluation",
      dataIndex: "funding_evaluation",
      key: "funding_evaluation",
      render: (text) => (
        <>
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
        </>
      ),
    },
    {
      title: "Payment Id",
      dataIndex: "id",
      key: "id",
      render: (text) => (
        <>
          <div className="copy_text_btn">
            <a href={`mailto:${text}`}>{text}</a>
            <Tooltip title="Copy Transaction ID">
              <Button
                icon={<CopyButton />}
                size="small"
                style={{ marginLeft: 8 }}
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
        </>
      ),
    },
    // {
    //   title: "Payment ID",
    //   dataIndex: "id",
    //   key: "id",
    //   render: (text) => (
    //     <>
    //       <div className="status_icon_wrapper">
    //         <img
    //           src={
    //             text?.id
    //               === true ? verifiedIcon : notVerifiedIcon
    //           }
    //           alt=""
    //         />
    //       </div>
    //     </>
    //   ),
    // },
    {
      title: "Payment Type",
      dataIndex: "payment_type",
      key: "payment_type",
      render: (text) => (
        <>
          <div className="copy_text_btn">
            <a href={`mailto:${text}`}>{text}</a>
            <Tooltip title="Copy Promo">
              <Button
                icon={<CopyButton />}
                size="small"
                style={{ marginLeft: 8 }}
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
        </>
      ),
    },
    {
      title: "Status",
      dataIndex: "payment_status",
      key: "payment_status",
    },
    {
      title: "Plan",
      dataIndex: "plan",
      key: "plan",
    },
    // {
    //   title: "Transaction ID",
    //   dataIndex: "transaction_id",
    //   key: "transaction_id",
    //   render: (text) => (
    //     <>
    //       <div className="copy_text_btn">
    //         <a href={`mailto:${text}`}>{text}</a>
    //         <Tooltip title="Copy Login ID">
    //           <Button
    //             icon={<CopyButton />}
    //             size="small"
    //             style={{ marginLeft: 8 }}
    //             onClick={() => {
    //               navigator.clipboard.writeText(text);
    //               notification.success({
    //                 message: "Login ID copied to clipboard",
    //                 placement: "topRight",
    //               });
    //             }}
    //             className="copy_btn"
    //           />
    //         </Tooltip>
    //       </div>
    //     </>
    //   ),
    // },
    {
      title: "Invoice",
      dataIndex: "transactionId",
      key: "transaction_Id",
      render: (_, record) => (

        <div className="btn-wrapper">
          {record?.invoice ?
            <a href={record?.invoice} target="_blank">
              <Button className="btn-block">
                {"In Voice"}
              </Button>
            </a> :
            <Button className="btn-block">
              {"-"}
            </Button>}
        </div>
      ),
    },

  ], [paymentData])


  useEffect(() => {
    fetchPayments(idToken, pageSize, pageNo, searchText, activeTab, dates);
  }, [idToken, pageSize, pageNo, searchText, activeTab, dates])

  function fetchPayments(idToken, pageSize, pageNo, searchText, activeTab, dates) {
    dispatch(paymentListReq({ idToken, pageSize, pageNo, searchText, activeTab, dates }));
  }

  const handleSearch = (value) => {
    setPageNo(1);
    setPageSize(20);
    setSearchText(value);
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
  };

  const handleStatusChange = (index, status) => { };

  function triggerChange(page, updatedPageSize) {
    setPageNo(page);
    setPageSize(updatedPageSize)
  }

  function updateDateRange(dates) {
    setDates(dates.map((date) => date.format("YYYY-MM-DD")));
  }


  const rangePresets = [
    { label: "Last 1 month", value: [dayjs().subtract(1, "month"), dayjs()] },
    { label: "Last 3 months", value: [dayjs().subtract(3, "months"), dayjs()] },
    { label: "Last 6 months", value: [dayjs().subtract(6, "months"), dayjs()] },
    { label: "Last 1 year", value: [dayjs().subtract(1, "year"), dayjs()] },
    { label: "All time", value: [dayjs().subtract(20, "years"), dayjs()] }, // Assuming "All time" covers a very long period
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
                handleSearch(e.target.value)
              }
            }}
          />
          <div className="searchImg" onClick={() => handleSearch(search)}>
            <img src={searchIcon} alt="searchIcon" />
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
        <RangePicker placeholder={dates} defaultValue={defaultDates} onChange={updateDateRange} autoFocus presets={rangePresets} />
        </div>
        </div>
        <div className="export_btn">
          <Button onClick={handleCloseModal}>
            <img src={exportBtnIcon} alt="export_btn_icon" />
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
      <Card className="table-wrapper">
        {isLoading ? (
          <LoaderOverlay />
        ) : (
          <AntTable
            // data={paymentData?.data || []}
            data={paymentData?.results || paymentData || []}
            columns={columns}
            totalPages={Math.ceil(count / pageSize)}
            totalItems={count}
            pageSize={pageSize}
            CurrentPageNo={pageNo}
            setPageSize={setPageSize}
            triggerChange={triggerChange}
          />
        )}
      </Card>

      {isModalVisible === true ? (
        <CalendarModal idToken={idToken} handleCloseModal={handleCloseModal} />
      ) : (
        ""
      )}
    </div>
  );
};

export default Payment;

const CalendarModal = ({ idToken, handleCloseModal }) => {

  const { exportLink } = useSelector(state => state.payment);
  const { searchDates } = useSelector(state => state.auth)
  const [dates, setdates] = useState(searchDates);
  const onRangeChange = (selectedDates) => {
    setdates(selectedDates.map((value) => value.format("YYYY-MM-DD")));
  };
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(paymentExportsReq({ idToken, dates, dispatch }));
  }, [dates])

  const rangePresets = [
    { label: "Last 1 month", value: [dayjs().subtract(1, "month"), dayjs()] },
    { label: "Last 3 months", value: [dayjs().subtract(3, "months"), dayjs()] },
    { label: "Last 6 months", value: [dayjs().subtract(6, "months"), dayjs()] },
    { label: "Last 1 year", value: [dayjs().subtract(1, "year"), dayjs()] },
    { label: "All time", value: [dayjs().subtract(20, "years"), dayjs()] }, // Assuming "All time" covers a very long period
  ];

  const [placement, SetPlacement] = useState("bottomLeft");
  const placementChange = (e) => {
    SetPlacement(e.target.value);
  };

  return (
    <div className="calendarModal_container" onClick={handleCloseModal}>
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
          {
            exportLink != "" ?
              <a
                href={`${exportLink}`}
                target="_blank"           >

                <Button className="standard_button">Export</Button>
              </a> :
              <Button className="standard_button">Export</Button>
          }
        </div>
      </div>
    </div>
  );
};
