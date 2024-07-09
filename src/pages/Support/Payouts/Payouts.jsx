import React, { useEffect, useState } from "react";
import "./Payouts.scss";
import {
  DatePicker,
  Input,
  Button,
  Select,
  Dropdown,
  Menu,
  Modal,
  Form,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import kyc from "../../../assets/icons/greenTick.svg";
import payoutInvoiceIcon from "../../../assets/icons/payoutInvoiceIcon.svg";
import searchIcon from "../../../assets/icons/searchIcon.svg";
import comment from "../../../assets/icons/comment.svg";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { payoutListReq, payoutListUpdateReq } from "../../../store/NewReducers/payout";

import dayjs from "dayjs";

// const { TabPane } = Tabs;
// const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const Payouts = () => {
  const [category, setCategory] = useState("all");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [editComment, setEditComment] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { payoutData, count } = useSelector((state) => state.payoutList);
  const { idToken, searchDates } = useSelector((state) => state.auth);

  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [pageSize, setPageSize] = useState(20);
  const [pageNo, setPageNo] = useState(1);
  const [dates, setDates] = useState(searchDates);
  const defaultDates = [dayjs().subtract(7, 'day'), dayjs()];


  function triggerChange(page, updatedPageSize) {
    setPageNo(page);
    setPageSize(updatedPageSize);
  }
  function updateDateRange(dates) {
    setDates(dates.map((date) => date.format("YYYY-MM-DD")));
  }

  const [data, setData] = useState([{
    id: "snkjxsa",
    email: "masusaxkasasm.tech",
    commission: ["Commission A", "Commission B"],
    settlement_details: { bank: "ABC Bank", account_number: "1234567890" },
    payout_type: "PkkFS",
    method: "Rkjnkjise",
    amount: 1349845,
    status: "rejected",
    invoice: null,
    reason: null,
    comment: null,
    login_id: "4hjhjh2",
    profit_split: 90,
    created_at: "2024-06-20T12:56:26.760212Z",
    updated_on: "2024-06-20T12:57:17.203798Z",
    is_reinstated: true,
  },
  {
    id: "ajhdx2b",
    email: "example@example.com",
    commission: ["Commission C", "Commission D"],
    settlement_details: { bank: "XYZ Bank", account_number: "0987654321" },
    payout_type: "ZtyHS",
    method: "Poiuytrew",
    amount: 289746,
    status: "accepted",
    invoice: "https://example.com/invoice1.pdf",
    reason: "Incomplete details",
    comment: "Needs further verification",
    login_id: "8xyzabc",
    profit_split: 80,
    created_at: "2024-06-21T10:32:45.123456Z",
    updated_on: "2024-06-21T11:15:30.987654Z",
    is_reinstated: false,
  },
  {
    id: "snkjxsa",
    email: "masusaxkasasm.tech",
    commission: ["Commission A", "Commission B"],
    settlement_details: { bank: "ABC Bank", account_number: "1234567890" },
    payout_type: "PkkFS",
    method: "Rkjnkjise",
    amount: 1349845,
    status: "rejected",
    invoice: null,
    reason: null,
    comment: null,
    login_id: "4hjhjh2",
    profit_split: 90,
    created_at: "2024-06-20T12:56:26.760212Z",
    updated_on: "2024-06-20T12:57:17.203798Z",
    is_reinstated: true,
  },
  {
    id: "ajhdx2b",
    email: "example@example.com",
    commission: ["Commission C", "Commission D"],
    settlement_details: { bank: "XYZ Bank", account_number: "0987654321" },
    payout_type: "ZtyHS",
    method: "Poiuytrew",
    amount: 289746,
    status: "accepted",
    invoice: "https://example.com/invoice1.pdf",
    reason: "Incomplete details",
    comment: "Needs further verification",
    login_id: "8xyzabc",
    profit_split: 80,
    created_at: "2024-06-21T10:32:45.123456Z",
    updated_on: "2024-06-21T11:15:30.987654Z",
    is_reinstated: false,
  },]);

  useEffect(() => {
    dispatch(
      payoutListReq({
        idToken,
        pageSize,
        pageNo,
        searchText,
        activeTab,
        dates,
        dispatch,
      })
    );
  }, [idToken, dates, pageSize, pageNo, searchText, activeTab]);

  useEffect(() => {
    // setData(payoutData || [
    setData([
      {
        id: "snkjxsa",
        email: "masusaxkasasm.tech",
        commission: ["Commission A", "Commission B"],
        settlement_details: { bank: "ABC Bank", account_number: "1234567890" },
        payout_type: "PkkFS",
        method: "Rkjnkjise",
        amount: 1349845,
        status: "rejected",
        invoice: null,
        reason: null,
        comment: null,
        login_id: "4hjhjh2",
        profit_split: 90,
        created_at: "2024-06-20T12:56:26.760212Z",
        updated_on: "2024-06-20T12:57:17.203798Z",
        is_reinstated: true,
      },
      {
        id: "ajhdx2b",
        email: "example@example.com",
        commission: ["Commission C", "Commission D"],
        settlement_details: { bank: "XYZ Bank", account_number: "0987654321" },
        payout_type: "ZtyHS",
        method: "Poiuytrew",
        amount: 289746,
        status: "accepted",
        invoice: "https://example.com/invoice1.pdf",
        reason: "Incomplete details",
        comment: "Needs further verification",
        login_id: "8xyzabc",
        profit_split: 80,
        created_at: "2024-06-21T10:32:45.123456Z",
        updated_on: "2024-06-21T11:15:30.987654Z",
        is_reinstated: false,
      },
    ]
    );
  }, [payoutData]);



  // const columns = [
  //   {
  //     title: "Admin Email ID",
  //     dataIndex: "adminEmailID",
  //     key: "adminEmailID",
  //     render: (text) => highlightText(text, searchText),
  //   },
  //   {
  //     title: "Date and Time",
  //     dataIndex: "dateTime",
  //     key: "dateTime",
  //     render: (text) => highlightText(text, searchText),
  //   },
  //   {
  //     title: "Login ID",
  //     dataIndex: "loginID",
  //     key: "loginID",
  //     render: (text) => highlightText(text, searchText),
  //   },
  //   {
  //     title: "Payment Mode",
  //     dataIndex: "paymentMode",
  //     key: "paymentMode",
  //     render: (text) => highlightText(text, searchText),
  //   },
  //   {
  //     title: "KYC",
  //     dataIndex: "kyc",
  //     key: "kyc",
  //     render: (imageSrc) => (
  //       <img src={imageSrc} alt="Invoice" className="invoice-icon" />
  //     ),
  //   },
  //   {
  //     title: "Profit Split",
  //     dataIndex: "profitSplit",
  //     key: "profitSplit",
  //     render: (text) => highlightText(text, searchText),
  //   },
  //   {
  //     title: "Bonus",
  //     dataIndex: "bonus",
  //     key: "bonus",
  //     render: (text) => highlightText(text, searchText),
  //   },
  //   {
  //     title: "Amount",
  //     dataIndex: "amount",
  //     key: "amount",
  //     render: (text) => highlightText(text, searchText),
  //   },
  //   {
  //     title: "Status",
  //     dataIndex: "status",
  //     key: "status",
  //     render: (text, record, index) => (
  //       <Dropdown overlay={() => statusMenu(index)} trigger={["click"]}>
  //         <Button
  //           icon={<DownOutlined />}
  //           className="status-button"
  //           style={{
  //             width: "120px",
  //             display: "flex",
  //             flexDirection: "row-reverse",
  //             justifyContent: "space-between",
  //             padding: "6px 10px",
  //           }}
  //         >
  //           {text}
  //         </Button>
  //       </Dropdown>
  //     ),
  //   },
  //   {
  //     title: "Comment",
  //     dataIndex: "comment",
  //     key: "comment",
  //     render: (text, record, index) => (
  //       <div className="comment-cell">
  //         {highlightText(text, searchText)}
  //         <img
  //           src={comment}
  //           alt="comment"
  //           className="edit-icon"
  //           onClick={() => openEditModal(text, index)}
  //         />
  //       </div>
  //     ),
  //   },
  //   {
  //     title: "Invoice",
  //     dataIndex: "invoice",
  //     key: "invoice",
  //     render: (imageSrc) => (
  //       <img src={imageSrc} alt="Invoice" className="invoice-icon" />
  //     ),
  //   },
  //   {
  //     title: "Action",
  //     dataIndex: "action",
  //     key: "action",
  //     render: (actions, record, index) => (
  //       <>
  //         <div className="action_button">
  //           <Button
  //             className="standard_button custom"
  //             onClick={() => openActionModal("Accept", index)}
  //           >
  //             {actions.actionOne}
  //           </Button>
  //           <Button
  //             className="reject_button"
  //             onClick={() => openActionModal("Reject", index)}
  //           >
  //             {actions.actionTwo}
  //           </Button>
  //         </div>
  //       </>
  //     ),
  //   },
  // ];

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Commission",
      dataIndex: "commission",
      key: "commission",
      render: (commission) => (
        <ul>
          {commission.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ),
    },
    {
      title: "Settlement Details",
      dataIndex: "settlement_details",
      key: "settlement_details",
      render: (settlement_details) => (
        <ul>
          {Object.entries(settlement_details).map(([key, value], index) => (
            <li key={index}>
              <strong>{key}:</strong> {value}
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: "Payout Type",
      dataIndex: "payout_type",
      key: "payout_type",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Method",
      dataIndex: "method",
      key: "method",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record, index) => (
        <Dropdown
          overlay={() => statusMenu(record, index)}
          trigger={["click"]}
        // onClick={() => handleStatusChange(text, record, index)} 
        >
          <Button
            icon={<DownOutlined />}
            className="status-button"
            style={{
              width: "120px",
              display: "flex",
              flexDirection: "row-reverse",
              justifyContent: "space-between",
              padding: "6px 10px",
            }}
          >
            {text}
          </Button>
        </Dropdown>
      ),
    },
    {
      title: "Login ID",
      dataIndex: "login_id",
      key: "login_id",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Profit Split",
      dataIndex: "profit_split",
      key: "profit_split",
      render: (text) => <span>{text}%</span>,
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => <span>{new Date(text).toLocaleString()}</span>,
    },
    {
      title: "Updated On",
      dataIndex: "updated_on",
      key: "updated_on",
      render: (text) => <span>{new Date(text).toLocaleString()}</span>,
    },
    {
      title: "Is Reinstated",
      dataIndex: "is_reinstated",
      key: "is_reinstated",
      render: (text) => <span>{text ? "Yes" : "No"}</span>,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (actions, record, index) => (
        <>
          <div className="action_button">
            <Button
              className="standard_button custom"
              onClick={() => openActionModal("Accept", index)}
            >
              {"Accept"}
            </Button>
            <Button
              className="reject_button"
              onClick={() => openActionModal("Reject", index)}
            >
              {"Reject"}
            </Button>
          </div>
        </>
      ),
    },
  ];
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
    setCategory(value);
  };

  // const handleStatusChange = (index, status) => {
  //   const newData = [...data];
  //   newData[index].status = status;
  //   setData(newData);
  // };
  // const filteredData = data?.filter((item) => {
  //   return (
  //     (activeTab === "all" || item?.status.toLowerCase() === activeTab) &&
  //     (category === "all" || item?.paymentMode.toLowerCase() === category) &&
  //     Object.values(item).some((val) =>
  //       String(val).toLowerCase().includes(searchText.toLowerCase())
  //     )
  //   );
  // });
  // const highlightText = (text, search) => {
  //   if (!search) return text;
  //   const regex = new RegExp(`(${search})`, "gi");
  //   const parts = String(text)?.split(regex);
  //   return (
  //     <>
  //       {parts.map((part, index) =>
  //         regex.test(part) ? (
  //           <span key={index} className="highlight">
  //             {part}
  //           </span>
  //         ) : (
  //           part
  //         )
  //       )}
  //     </>
  //   );
  // };

  const handleStatusChange = (text, record, index) => {
    // const newData = [...data];
    // newData[index].status = status;
    // setData(newData);
    // console.log(text, record, index)
  };

  const handleMenuClick = (e, record) => {
    const selectedStatus = e.key;
    const formData = new FormData();
    formData.append('status', selectedStatus);
    dispatch(payoutListUpdateReq({ idToken, id: record?.id, updatedStatus: formData, dispatch }));
  };

  const statusMenu = (record, index) => (
    <Menu onClick={(e) => handleMenuClick(e, record)}>
      <Menu.Item key="new">New</Menu.Item>
      <Menu.Item key="approved">Approved</Menu.Item>
      <Menu.Item key="in_progress">In Process</Menu.Item>
      <Menu.Item key="rejected">Rejected</Menu.Item>
    </Menu>
  );


  const openEditModal = (comment, index) => {
    setEditComment(comment);
    setEditIndex(index);
    setIsModalVisible(true);
  };

  const handleEditComment = () => {
    // const newData = [...data];
    // newData[editIndex].comment = editComment;
    // setData(newData);
    // setIsModalVisible(false);
    console.log("Will work on edit when api is available");
  };

  const openActionModal = (action, index) => {
    console.log("ACTIONNNN : ", action, index);
    setIsModalVisible(true);
    setEditIndex(index);
    setModalAction(action);
  };

  const handleAction = () => {
    // const newData = [...data];
    // if (modalAction === "Accept") {
    //   newData[editIndex].status = "Approved";
    // } else if (modalAction === "Reject") {
    //   newData[editIndex].status = "Rejected";
    // }
    // setData(newData);
    // setIsModalVisible(false);
    console.log("Will work on Action when api is available");
  };

  useEffect(() => {
    console.log("isModalVisible : ", isModalVisible);
  }, [isModalVisible])

  return (
    <>
      { }
      <div className="payout_container">
        <div className="mobile_headers">
          <h4>Payout</h4>
        </div>
        <div className="header_wrapper">
          <h3>Payouts Table</h3>
          {/* <Button
            // onClick={() => navigate("payout-view-logs")}
            className="view_logs__btn standard_button"
          >
            View Logs
          </Button> */}
        </div>
        <div className="table_header_filter">
          <div className="search_box_wrapper search_box_wrapper">
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
              className={activeTab === "rejected" ? "active" : ""}
              onClick={() => handleTabChange("rejected")}
            >
              Rejected
            </Button>
            <Button
              className={activeTab === "in_progress" ? "active" : ""}
              onClick={() => handleTabChange("in_progress")}
            >
              In Progress
            </Button>
          </div>
          <RangePicker
            placeholder={dates}
            defaultValue={defaultDates}
            onChange={updateDateRange} />
        </div>
        <AntTable
          columns={columns}
          // data={data || []}        // For testing and Ui
          data={payoutData || []}
          totalPages={Math.ceil(count / pageSize)}
          totalItems={count}
          pageSize={pageSize}
          CurrentPageNo={pageNo}
          setPageSize={setPageSize}
          triggerChange={triggerChange}
        />
        <Modal
          title={modalAction}
          open={isModalVisible}
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
        </Modal>
      </div>
    </>
  );
};

export default Payouts;
