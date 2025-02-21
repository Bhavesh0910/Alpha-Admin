// import React, {useEffect, useMemo, useState} from "react";
// import "./Payment.scss";
// import AntTable from "../../ReusableComponents/AntTable/AntTable";
// import {DatePicker, Button, Select, Tooltip, notification, Card, Dropdown, Menu, Modal, Form, Input, message} from "antd";
// import {Link, useNavigate} from "react-router-dom";
// import searchIcon from "../../assets/icons/searchIcon.svg";
// import editIcon from "../../assets/icons/edit_icon_gray.svg";
// import exportBtnIcon from "../../assets/icons/export_btn_icon.svg";
// import verifiedIcon from "../../assets/icons/verified_green_circleIcon.svg";
// import {ReactComponent as Download} from "../../assets/icons/download.svg";
// import notVerifiedIcon from "../../assets/icons/notverified_red_circleIcon.svg";
// import {ReactComponent as CopyButton} from "../../assets/icons/copyButtonGray.svg";
// import dayjs from "dayjs";
// import {paymentExportsReq, paymentListReq, selectedEmail, updatePaymentStatusReq} from "../../store/NewReducers/payment";
// import {useDispatch, useSelector} from "react-redux";
// import moment from "moment";
// import LoaderOverlay from "../../ReusableComponents/LoaderOverlay";
// import {CopyOutlined, DownOutlined} from "@ant-design/icons";
// import {returnErrors} from "../../store/reducers/error";
// import {returnMessages} from "../../store/reducers/message";
// import CopyToClipboard from "react-copy-to-clipboard";
// const {Option} = Select;
// const {RangePicker} = DatePicker;

// const Payment = () => {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState(null);
//   const [searchText, setSearchText] = useState("");
//   const [search, setSearch] = useState("");
//   const [category, setCategory] = useState("all");

//   const dispatch = useDispatch();
//   const {idToken, searchDates} = useSelector((state) => state.auth);
//   const {paymentData, isLoading, refetch} = useSelector((state) => state.payment);

//   const [pageSize, setPageSize] = useState(20);
//   const [pageNo, setPageNo] = useState(1);
//   const [dates, setDates] = useState();

//   const [statusModelVisible, setStatusModelVisible] = useState(false);
//   const [modalAction, setModalAction] = useState("");
//   const [userToUpdate, setuserToUpdate] = useState(null);
//   const [updatedStatus, setUpdatedStatus] = useState(null);

//   const [editCommentToUpdate, setEditCommentToUpdate] = useState(null);

//   const [defaultDates, setDefaultDates] = useState();

//   const [isValidRange, setIsValidRange] = useState(true);
//   const [lastValidRange, setLastValidRange] = useState({startDate: null, endDate: null});

//   const columns = useMemo(
//     () => [
//       // {
//       //   title: "Name",
//       //   dataIndex: "name",
//       //   key: "name",
//       //   width: 150,
//       //   render: (text) => text,
//       // },
//       {
//         title: "Email",
//         dataIndex: "email",
//         key: "email",
//         width: 150,
//         render: (text) => {
//           return (
//             <div className="copy_text_btn">
//               {text ? (
//                 <>
//                   <a href={`mailto:${text}`}>{text}</a>
//                   <CopyToClipboard text={text || "-"}>
//                     <Tooltip title="Copy email">
//                       <Button
//                         type="link"
//                         icon={<CopyButton />}
//                         onClick={() => message.success("Copied email")}
//                         disabled={!text}
//                       />
//                     </Tooltip>
//                   </CopyToClipboard>
//                 </>
//               ) : (
//                 "-"
//               )}
//             </div>
//           );
//         },
//       },
//       {
//         title: "Payment ID",
//         dataIndex: "payment_id",
//         key: "payment_id",
//         width: 100,
//         render: (text) => (
//           <>
//             {text ? (
//               <div className="copy_text_btn">
//                 <div>{text}</div>
//                 <CopyToClipboard text={text || "-"}>
//                   <Tooltip title="Copy payment id">
//                     <Button
//                       type="link"
//                       icon={<CopyButton />}
//                       onClick={() => message.success("Copied payment id")}
//                       disabled={!text}
//                     />
//                   </Tooltip>
//                 </CopyToClipboard>
//               </div>
//             ) : (
//               "-"
//             )}
//           </>
//         ),
//       },
//       {
//         title: "Transaction ID",
//         dataIndex: "transaction_id",
//         key: "transaction_id",
//         width: 200,
//         render: (text) => (
//           <>
//             {text ? (
//               <div className="copy_text_btn">
//                 <a href={`mailto:${text}`}>{text}</a>
//                 <Tooltip title="Copy Transaction ID">
//                   <Button
//                     icon={<CopyButton />}
//                     size="small"
//                     style={{marginLeft: 8}}
//                     onClick={() => {
//                       navigator.clipboard.writeText(text);
//                       notification.success({
//                         message: "Transaction ID copied to clipboard",
//                         placement: "topRight",
//                       });
//                     }}
//                     className="copy_btn"
//                   />
//                 </Tooltip>
//               </div>
//             ) : (
//               "-"
//             )}
//           </>
//         ),
//       },
//       {
//         title: "Payment Status",
//         dataIndex: "payment_status",
//         key: "payment_status",
//         width: 120,
//         render: (text) => (text ? text : "-"),
//       },
//       // {
//       //   title: "Payment Platform Status",
//       //   dataIndex: "payment_platform_status",
//       //   key: "payment_platform_status",
//       //   width: 180,
//       // },
//       {
//         title: "Promo",
//         dataIndex: "promo_code",
//         key: "promo_code",
//         width: 50,
//         render: (text) => (
//           <>
//             {text ? (
//               <div className="copy_text_btn">
//                 <div href={`mailto:${text}`}>{text}</div>
//                 <Tooltip title="Copy Promo">
//                   <Button
//                     icon={<CopyButton />}
//                     size="small"
//                     style={{marginLeft: 8}}
//                     onClick={() => {
//                       navigator.clipboard.writeText(text);
//                       notification.success({
//                         message: "Promo copied to clipboard",
//                         placement: "topRight",
//                       });
//                     }}
//                     className="copy_btn"
//                   />
//                 </Tooltip>
//               </div>
//             ) : (
//               "-"
//             )}
//           </>
//         ),
//       },
//       {
//         title: "Amount",
//         dataIndex: "amount",
//         key: "amount",
//         width: 150,
//         render: (amount) => (amount ? <span>{amount ? `$${amount / 100}` : "-"}</span> : "-"),
//       },
//       {
//         title: "Date",
//         dataIndex: "created_at",
//         key: "created_at",
//         width: 150,
//         render: (text) => (text ? moment(text).format("YYYY-MM-DD") : "-"),
//       },
//       {
//         title: "Login ID",
//         dataIndex: "account_login_id",
//         key: "account_login_id",
//         width: 150,
//       },
//       {
//         title: "Challenge",
//         dataIndex: "challenge_name",
//         key: "challenge_name",
//         width: 150,
//         render: (text) => (text ? text : "-"),
//       },
//       {
//         title: "Invoice",
//         dataIndex: "invoice",
//         key: "invoice",
//         width: 150,
//         render: (text) =>
//           text && text !== "N/A" ? (
//             <a
//               href={text}
//               target="_blank"
//             >
//               <Download />
//             </a>
//           ) : (
//             "-"
//           ),
//       },
//       {
//         title: "Status",
//         dataIndex: "payment_status",
//         key: "payment_status",
//         render: (text, record, index) =>
//           text === "succeeded" ? (
//             <Dropdown
//               overlay={() => statusMenu(text, record)}
//               trigger={["click"]}
//               getPopupContainer={(triggerNode) => triggerNode.closest(".ant-table-body")}
//             >
//               <Button
//                 icon={<DownOutlined />}
//                 className="status_button"
//                 style={{
//                   width: "160px",
//                   display: "flex",
//                   flexDirection: "row-reverse",
//                   justifyContent: "space-between",
//                   padding: "6px 10px",
//                 }}
//               >
//                 <p className={text === "New" ? "new" : text === "In Progress" ? "in_progress" : text === "Approved" ? "approved" : text === "Failed" ? "failed" : text === "Pending" ? "Pending" : ""}>
//                   {text?.slice(0, 1).toUpperCase() + text?.slice(1, text?.length) || "-"}
//                 </p>
//               </Button>
//             </Dropdown>
//           ) : (
//             text
//           ),
//       },
//     ],
//     [paymentData],
//   );

//   const statusMenu = (key, record) => (
//     <Menu
//       className="menuCard"
//       onClick={(e) => openStatusUpdateModal(e.key, record)}
//     >
//       <Menu.Item key="Refunded">Refund</Menu.Item>
//       {/* <Menu.Item key="New">New</Menu.Item>
//       <Menu.Item key="Approved">Approved</Menu.Item>
//       <Menu.Item key="In Progress">In Progress</Menu.Item>
//       <Menu.Item key="Rejected">Rejected</Menu.Item>
//       <Menu.Item key="Flagged">Flagged</Menu.Item>
//       <Menu.Item key="Dissmissed">Dissmissed</Menu.Item> */}
//     </Menu>
//   );

//   const handleUpdateStatus = () => {
//     let body = {payment_status: updatedStatus};
//     dispatch(updatePaymentStatusReq({idToken, body, id: userToUpdate?.id, dispatch}));
//     setStatusModelVisible(false);
//   };

//   const openStatusUpdateModal = (updatedValue, record) => {
//     console.log(updatedValue, record);
//     setuserToUpdate(record);
//     setUpdatedStatus(updatedValue);
//     setStatusModelVisible(true);
//     setModalAction("Update Status");
//   };

//   useEffect(() => {
//     fetchPayments(idToken, pageSize, pageNo, searchText, activeTab, dates);
//   }, [idToken, pageSize, pageNo, searchText, activeTab, dates, refetch]);

//   function fetchPayments(idToken, pageSize, pageNo, searchText, activeTab, dates) {
//     let query = `?page=${pageNo || 1}&page_size=${pageSize || 20}&status=${activeTab === "paid" ? 1 : activeTab === "unpaid" ? 0 : ""}`;

//     // if (activeTab) {
//     //   query += `&payment_status=${activeTab}`;
//     // }
//     if (searchText) {
//       query = query + `&search=${searchText}`;
//     }
//     if (dates) {
//       let startDate = dates[0]?.format("YYYY-MM-DD");
//       let endDate = dates[1]?.format("YYYY-MM-DD");
//       query = query + `&start_date=${startDate}&end_date=${endDate}`;
//     }

//     dispatch(paymentListReq({idToken, query, dispatch}));
//   }

//   const handleSearch = (value) => {
//     setPageNo(1);
//     setPageSize(20);
//     setSearchText(value);
//   };

//   const handleTabChange = (value) => {
//     setPageNo(1);
//     setActiveTab(value);
//   };

//   const handleCategoryChange = (value) => {
//     setPageNo(1);
//     setCategory(value);
//   };

//   function triggerChange(page, updatedPageSize) {
//     setPageNo(page);
//     setPageSize(updatedPageSize);
//   }

//   const updateDateRange = (dates) => {
//     setPageNo(1);

//     if (dates && dates.length === 2) {
//       const [startDate, endDate] = dates;

//       if (endDate.isAfter(dayjs()) || startDate.isAfter(dayjs())) {
//         notification.error({
//           message: "Invalid Date Range",
//           description: `The selected date range (${startDate.format("YYYY-MM-DD")} - ${endDate.format("YYYY-MM-DD")}) contains future dates. Please select a valid range.`,
//         });

//         if (lastValidRange) {
//           setDefaultDates([lastValidRange.startDate, lastValidRange.endDate]);
//           return;
//         }

//         setDefaultDates(null);
//         setIsValidRange(false);
//         return;
//       }

//       setDates(dates);
//       setLastValidRange({startDate, endDate});
//       setDefaultDates(dates);
//       setIsValidRange(true);
//     } else {
//       setDates(null);
//       setDefaultDates(null);
//     }
//   };

//   const rangePresets = [
//     {label: "Last 1 month", value: [dayjs().subtract(1, "month"), dayjs()]},
//     {label: "Last 3 months", value: [dayjs().subtract(3, "months"), dayjs()]},
//     {label: "Last 6 months", value: [dayjs().subtract(6, "months"), dayjs()]},
//     {label: "Last 1 year", value: [dayjs().subtract(1, "year"), dayjs()]},
//     {label: "All time", value: [dayjs().subtract(20, "years"), dayjs()]}, // Assuming "All time" covers a very long period
//   ];

//   const [isModalVisible, setModalVisible] = useState(false);

//   const handleCloseModal = () => {
//     setModalVisible(true);
//   };
//   const {exportLink} = useSelector((state) => state.payment);

//   return (
//     <div className="payment_container">
//       <div className="header_wrapper">
//         <Button
//           onClick={() => navigate("/payments/payments-view-logs")}
//           className="view_logs__btn standard_button"
//         >
//           View Logs
//         </Button>
//       </div>
//       <div className="table_header_filter">
//         <div className="header_left">
//           <div className="search_box_wrapper">
//             {/* <Select
//               className="category_dropdown"
//               defaultValue="all"
//               onChange={handleCategoryChange}
//             >
//               <Option value="all">All Categories</Option>

//             </Select> */}
//             <input
//               placeholder="Search by Email , Payment Id..."
//               className="search_input"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") {
//                   handleSearch(e.target.value);
//                 }
//               }}
//             />
//             <div
//               className="searchImg"
//               onClick={() => handleSearch(search)}
//             >
//               <img
//                 src={searchIcon}
//                 alt="searchIcon"
//               />
//             </div>
//           </div>
//           <div className="header_middle">
//             <div className="filter_buttons">
//               <Button
//                 className={activeTab === null ? "active" : ""}
//                 onClick={() => handleTabChange(null)}
//               >
//                 All
//               </Button>
//               <Button
//                 className={activeTab === "paid" ? "active" : ""}
//                 onClick={() => handleTabChange("paid")}
//               >
//                 Paid
//               </Button>
//               <Button
//                 className={activeTab === "unpaid" ? "active" : ""}
//                 onClick={() => handleTabChange("unpaid")}
//               >
//                 Unpaid
//               </Button>
//               {/* <Button
//                 className={activeTab === "refunded" ? "active" : ""}
//                 onClick={() => handleTabChange("refunded")}
//               >
//                 Refunded
//               </Button> */}
//             </div>
//             <div className="paymentDateRange">
//               <RangePicker
//                 value={defaultDates}
//                 onChange={updateDateRange}
//                 presets={rangePresets}
//               />
//             </div>
//           </div>
//         </div>
//         <div className="export_btn">
//           <Button onClick={handleCloseModal}>
//             <img
//               src={exportBtnIcon}
//               alt="export_btn_icon"
//             />
//             Export
//           </Button>
//           <Link
//             to={"/payments/payments-export-history"}
//             style={{color: "white"}}
//           >
//             View Export History
//           </Link>
//         </div>
//       </div>
//       <div className="table-wrapper">
//         {isLoading ? (
//           <LoaderOverlay />
//         ) : (
//           <AntTable
//             // data={paymentData?.data || []}
//             data={paymentData?.results || paymentData || []}
//             columns={columns}
//             totalPages={Math.ceil(paymentData?.count / pageSize)}
//             totalItems={paymentData?.count}
//             pageSize={pageSize}
//             CurrentPageNo={pageNo}
//             setPageSize={setPageSize}
//             triggerChange={triggerChange}
//             isExpandable={true}
//             ExpandedComp={ExpandableRow}
//             rowId={"id"}
//           />
//         )}
//       </div>

//       {isModalVisible === true ? (
//         <CalendarModal
//           idToken={idToken}
//           status={activeTab}
//           setModalVisible={setModalVisible}
//           handleCloseModal={handleCloseModal}
//           exportLink={exportLink}
//         />
//       ) : (
//         ""
//       )}
//       <Modal
//         title={modalAction}
//         open={statusModelVisible}
//         onCancel={() => {
//           setStatusModelVisible(false);
//           setEditCommentToUpdate(null);
//           setuserToUpdate(null);
//         }}
//         onOk={handleUpdateStatus}
//       >
//         <Form.Item label="Comment">
//           <Input.TextArea
//             value={editCommentToUpdate}
//             onChange={(e) => setEditCommentToUpdate(e.target.value)}
//             placeholder="Write your comment here.."
//           />
//         </Form.Item>
//       </Modal>
//     </div>
//   );
// };

// export default Payment;

// const CalendarModal = ({idToken, exportLink, status, handleCloseModal, setModalVisible}) => {
//   const dispatch = useDispatch();

//   const [dates, setDates] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const rangePresets = [
//     {label: "Last 1 month", value: [dayjs().subtract(1, "month"), dayjs()]},
//     {label: "Last 3 months", value: [dayjs().subtract(3, "months"), dayjs()]},
//     {label: "Last 6 months", value: [dayjs().subtract(6, "months"), dayjs()]},
//     {label: "Last 1 year", value: [dayjs().subtract(1, "year"), dayjs()]},
//     {label: "All time", value: [dayjs().subtract(20, "years"), dayjs()]},
//   ];

//   const onRangeChange = (dates) => {
//     // setPageNo(1);
//     if (dates) {
//       setDates(dates.map((date) => date.format("YYYY-MM-DD")));
//       console.log(dates);
//     } else {
//       setDates([]);
//     }
//   };

//   const handleExport = () => {
//     if (dates && dates?.length === 2) {
//       const [startDate, endDate] = dates;
//       let query = `?start_date=${startDate}&end_date=${endDate}&status=${status === "all" ? "" : status === "paid" ? 1 : 0}`;

//       dispatch(paymentExportsReq({idToken, query, dispatch}))
//         .unwrap()
//         .then((response) => {
//           const {s3_file_url, filename} = response?.data;
//           const link = document.createElement("a");
//           link.href = s3_file_url;
//           link.download = filename;
//           document.body.appendChild(link);
//           link.click();
//           document.body.removeChild(link);
//           setModalVisible(false);
//           dispatch(returnMessages("Export Successful", 200));

//           setModalVisible(false);
//         })
//         .catch((error) => {
//           dispatch(returnErrors("Export failed", 400));
//         });
//     } else {
//       notification.warning({
//         message: "Invalid Dates",
//         description: "Please select a valid date range.",
//       });
//     }
//   };

//   useEffect(() => {
//     if (exportLink) {
//       handleCloseModal();
//     }
//   }, [exportLink]);

//   return (
//     <div
//       className="calendarModal_container"
//       onClick={() => setModalVisible(false)}
//     >
//       <div
//         className="calendarModal_wrapper"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <h4>Export</h4>
//         <div className="calendar_wrapper">
//           <RangePicker
//             presets={rangePresets}
//             onChange={onRangeChange}
//           />
//         </div>
//         <p>File will contain information for the dates you’ve selected.</p>
//         <div className="calandarModal_export_btn">
//           <Button
//             className="standard_button"
//             onClick={handleExport}
//             loading={isLoading}
//           >
//             Export
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export const ExpandableRow = ({ record }) => {
//   const data = record?.meta_data ? JSON.parse(record?.meta_data) : null;
//   return (
//     <div className="paymentNestedTable">
//       <div>
//         <div>Name</div>
//         <p>{record?.name || "-"}</p>
//       </div>
//       <div>
//         <div>Payment Platform Status</div>
//         <p>{record?.payment_platform_status || "-"}</p>
//       </div>
//       {data &&
//         Object.keys(data)?.map((item) => (
//           <div key={item}>
//             <div>{item.replaceAll("_", " ")}</div>
//             <p>{data[item] !== undefined && data[item] !== null && data[item] !== "" ? String(data[item]) : "-"}</p>
//           </div>
//         ))}
//     </div>
//   );
// };

import React, {useEffect, useMemo, useState} from "react";
import "./Payment.scss";
import AntTable from "../../ReusableComponents/AntTable/AntTable";
import {DatePicker, Button, Select, Tooltip, notification, Card, Dropdown, Menu, Modal, Form, Input, message} from "antd";
import {Link, useNavigate} from "react-router-dom";
import searchIcon from "../../assets/icons/searchIcon.svg";
import editIcon from "../../assets/icons/edit_icon_gray.svg";
import exportBtnIcon from "../../assets/icons/export_btn_icon.svg";
import verifiedIcon from "../../assets/icons/verified_green_circleIcon.svg";
import {ReactComponent as Download} from "../../assets/icons/download.svg";
import notVerifiedIcon from "../../assets/icons/notverified_red_circleIcon.svg";
import {ReactComponent as CopyButton} from "../../assets/icons/copyButtonGray.svg";
import dayjs from "dayjs";
import {paymentExportsReq, paymentListReq, selectedEmail, updatePaymentStatusReq} from "../../store/NewReducers/payment";
import {useDispatch, useSelector} from "react-redux";
import moment from "moment";
import LoaderOverlay from "../../ReusableComponents/LoaderOverlay";
import {CopyOutlined, DownOutlined} from "@ant-design/icons";
import {returnErrors} from "../../store/reducers/error";
import {returnMessages} from "../../store/reducers/message";
import CopyToClipboard from "react-copy-to-clipboard";
const {Option} = Select;
const {RangePicker} = DatePicker;

const Payment = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const dispatch = useDispatch();
  const {idToken, searchDates} = useSelector((state) => state.auth);
  const {paymentData, isLoading, refetch} = useSelector((state) => state.payment);

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
  const [lastValidRange, setLastValidRange] = useState({startDate: null, endDate: null});

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
                  <CopyToClipboard text={text || "-"}>
                    <Tooltip title="Copy email">
                      <Button
                        type="link"
                        icon={<CopyButton />}
                        onClick={() => message.success("Copied email")}
                        disabled={!text}
                      />
                    </Tooltip>
                  </CopyToClipboard>
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
                <div>{text}</div>
                <CopyToClipboard text={text || "-"}>
                  <Tooltip title="Copy payment id">
                    <Button
                      type="link"
                      icon={<CopyButton />}
                      onClick={() => message.success("Copied payment id")}
                      disabled={!text}
                    />
                  </Tooltip>
                </CopyToClipboard>
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
                <div>{text}</div>
                <CopyToClipboard text={text || "-"}>
                  <Tooltip title="Copy Transaction ID">
                    <Button
                      icon={<CopyButton />}
                      size="small"
                      style={{marginLeft: 8}}
                      onClick={() => message.success("Copied Transaction ID")}
                      className="copy_btn"
                    />
                  </Tooltip>
                </CopyToClipboard>
              </div>
            ) : (
              "-"
            )}
          </>
        ),
      },
      {
        title: "Payment Status",
        dataIndex: "payment_platform_status",
        key: "payment_platform_status",
        width: 120,
        render: (text) => (text ? text : "-"),
      },
      // {
      //   title: "Payment Platform Status",
      //   dataIndex: "payment_platform_status",
      //   key: "payment_platform_status",
      //   width: 180,
      // },
      {
        title: "Promo",
        dataIndex: "promo",
        key: "promo",
        width: 100,
        render: (text) => (
          <>
            {text ? (
              <div className="copy_text_btn">
                <div>{text}</div>
                <CopyToClipboard text={text || "-"}>
                  <Tooltip title="Copy Promo">
                    <Button
                      icon={<CopyButton />}
                      size="small"
                      style={{marginLeft: 8}}
                      onClick={() => message.success("Copied Promo")}
                      className="copy_btn"
                    />
                  </Tooltip>
                </CopyToClipboard>
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
        render: (amount) => (amount ? <span>{amount ? `$${amount / 100}` : "-"}</span> : "-"),
      },
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
        width: 150,
        render: (text) => (text ? moment(text).format("YYYY-MM-DD") : "-"),
      },
      {
        title: "Login ID",
        dataIndex: "account_login_id",
        key: "account_login_id",
        width: 150,
      },
      {
        title: "Challenge",
        dataIndex: "challenge",
        key: "challenge",
        width: 150,
        render: (text) => (text ? text : "-"),
      },
      {
        title: "Invoice",
        dataIndex: "invoice",
        key: "invoice",
        width: 150,
        render: (text) =>
          text && text !== "N/A" ? (
            <a
              href={text}
              target="_blank"
            >
              <Download />
            </a>
          ) : (
            "-"
          ),
      },
      // {
      //   title: "Status",
      //   dataIndex: "payment_status",
      //   key: "payment_status",
      //   render: (text, record, index) =>
      //     text === "succeeded" ? (
      //       <Dropdown
      //         overlay={() => statusMenu(text, record)}
      //         trigger={["click"]}
      //         getPopupContainer={(triggerNode) => triggerNode.closest(".ant-table-body")}
      //       >
      //         <Button
      //           icon={<DownOutlined />}
      //           className="status_button"
      //           style={{
      //             width: "160px",
      //             display: "flex",
      //             flexDirection: "row-reverse",
      //             justifyContent: "space-between",
      //             padding: "6px 10px",
      //           }}
      //         >
      //           <p className={text === "New" ? "new" : text === "In Progress" ? "in_progress" : text === "succeeded" ? "approved" : text === "Failed" ? "failed" : text === "Pending" ? "Pending" : ""}>
      //             {text?.slice(0, 1).toUpperCase() + text?.slice(1, text?.length) || "-"}
      //           </p>
      //         </Button>
      //       </Dropdown>
      //     ) : (
      //       <Button className="status_button">
      //         <p
      //           className={
      //             text === "unpaid"
      //               ? "new"
      //               : text === "In Progress" || text === "in_progress" || text === "Pending" || text === "Payment Pending" || text === "pending"
      //               ? "in_progress"
      //               : text === "Approved" || text === "approved"
      //               ? "approved"
      //               : text === "Failed" || text === "rejected"
      //               ? "failed"
      //               : text === "expired" || text === "Expired" || text === "canceled"
      //               ? "rejected"
      //               : text === "Payment Received" || text === "succeeded" || text === "signed"
      //               ? "succeeded"
      //               : ""
      //           }
      //         >
      //           {text?.slice(0, 1).toUpperCase() + text?.slice(1) || "-"}
      //         </p>
      //       </Button>
      //     ),
      // },
      {
        title: "Status",
        dataIndex: "payment_status",
        key: "payment_status",
        width: 160,
        render: (text, record) => {
          let statusClass = "";
          switch (text.toLowerCase()) {
            case "expired":
            case "canceled":
            case "failed":
            case "rejected":
              statusClass = "status_rejected";
              break;
            case "pending":
            case "payment pending":
            case "in progress":
            case "in_progress":
            case "unpaid":
              statusClass = "status_in_progress";
              break;
            case "succeeded":
            case "payment received":
              statusClass = "status_succeeded";
              break;
            default:
              statusClass = "status_default";
              break;
          }

          const statusText = text?.charAt(0).toUpperCase() + text?.slice(1).toLowerCase() || "-";

          return text === "succeeded" ? (
            <Dropdown
              overlay={() => statusMenu(text, record)}
              trigger={["click"]}
              getPopupContainer={(triggerNode) => triggerNode.closest(".ant-table-body")}
            >
              <Button
                icon={<DownOutlined />}
                className={`status_button ${statusClass}`}
                style={{
                  width: "160px",
                  display: "flex",
                  flexDirection: "row-reverse",
                  justifyContent: "space-between",
                  padding: "6px 10px",
                }}
              >
                <p className={statusClass}>{statusText}</p>
              </Button>
            </Dropdown>
          ) : text === "refunded" || text === "Refunded" ? (
            <Dropdown
              overlay={() => statusMenu(text, record)}
              trigger={["click"]}
              getPopupContainer={(triggerNode) => triggerNode.closest(".ant-table-body")}
            >
              <Button
                icon={<DownOutlined />}
                className={`status_button ${statusClass}`}
                style={{
                  width: "160px",
                  display: "flex",
                  flexDirection: "row-reverse",
                  justifyContent: "space-between",
                  padding: "6px 10px",
                }}
              >
                <p className={statusClass}>{statusText}</p>
              </Button>
            </Dropdown>
          ) : (
            <Button className={`status_button ${statusClass}`}>
              <p className={statusClass}>{statusText}</p>
            </Button>
          );
        },
      },
    ],
    [paymentData],
  );

  const statusMenu = (key, record) => (
    <Menu
      className="menuCard"
      onClick={(e) => openStatusUpdateModal(e.key, record)}
    >
      {(key === "refunded" && <Menu.Item key="revoked">Revoked</Menu.Item>) || (key === "Refunded" && <Menu.Item key="revoked">Revoked</Menu.Item>)}
      {(key === "succeeded" && <Menu.Item key="Refunded">Refund</Menu.Item>) || (key === "succeeded" && <Menu.Item key="Refunded">Refund</Menu.Item>)}
      {/* <Menu.Item key="New">New</Menu.Item>
      <Menu.Item key="Approved">Approved</Menu.Item>
      <Menu.Item key="In Progress">In Progress</Menu.Item>
      <Menu.Item key="Rejected">Rejected</Menu.Item>
      <Menu.Item key="Flagged">Flagged</Menu.Item>
      <Menu.Item key="Dissmissed">Dissmissed</Menu.Item> 
      */}
    </Menu>
  );

  const handleUpdateStatus = () => {
    let body = {payment_status: updatedStatus};
    dispatch(updatePaymentStatusReq({idToken, body, id: userToUpdate?.id, dispatch}));
    setStatusModelVisible(false);
    setEditCommentToUpdate(null);
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
  }, [idToken, pageSize, pageNo, searchText, activeTab, dates, refetch]);

  function fetchPayments(idToken, pageSize, pageNo, searchText, activeTab, dates) {
    let query = `?page=${pageNo || 1}&page_size=${pageSize || 20}`;

    if (activeTab) {
      query += `&payment_status=${activeTab}`;
    }
    if (searchText) {
      query = query + `&search=${searchText}`;
    }
    if (dates) {
      let startDate = dates[0]?.format("YYYY-MM-DD");
      let endDate = dates[1]?.format("YYYY-MM-DD");
      query = query + `&start_date=${startDate}&end_date=${endDate}`;
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

  const updateDateRange = (dates) => {
    setPageNo(1);

    if (dates && dates.length === 2) {
      const [startDate, endDate] = dates;

      if (endDate.isAfter(dayjs()) || startDate.isAfter(dayjs())) {
        notification.error({
          message: "Invalid Date Range",
          description: `The selected date range (${startDate.format("YYYY-MM-DD")} - ${endDate.format("YYYY-MM-DD")}) contains future dates. Please select a valid range.`,
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
      setLastValidRange({startDate, endDate});
      setDefaultDates(dates);
      setIsValidRange(true);
    } else {
      setDates(null);
      setDefaultDates(null);
    }
  };

  const rangePresets = [
    {label: "Last 1 month", value: [dayjs().subtract(1, "month"), dayjs()]},
    {label: "Last 3 months", value: [dayjs().subtract(3, "months"), dayjs()]},
    {label: "Last 6 months", value: [dayjs().subtract(6, "months"), dayjs()]},
    {label: "Last 1 year", value: [dayjs().subtract(1, "year"), dayjs()]},
    {label: "All time", value: [dayjs().subtract(20, "years"), dayjs()]}, // Assuming "All time" covers a very long period
  ];

  const [isModalVisible, setModalVisible] = useState(false);

  const handleCloseModal = () => {
    setModalVisible(true);
  };
  const {exportLink} = useSelector((state) => state.payment);

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
                className={activeTab === null ? "active" : ""}
                onClick={() => handleTabChange(null)}
              >
                All
              </Button>
              <Button
                className={activeTab === "succeeded" ? "active" : ""}
                onClick={() => handleTabChange("succeeded")}
              >
                Paid
              </Button>
              <Button
                className={activeTab === "unpaid" ? "active" : ""}
                onClick={() => handleTabChange("unpaid")}
              >
                Unpaid
              </Button>
              <Button
                className={activeTab === "refunded" ? "active" : ""}
                onClick={() => handleTabChange("refunded")}
              >
                Refunded
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
            style={{color: "white"}}
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
        <Form.Item label="Comment">
          <Input.TextArea
            value={editCommentToUpdate}
            onChange={(e) => setEditCommentToUpdate(e.target.value)}
            placeholder="Write your comment here.."
          />
        </Form.Item>
      </Modal>
    </div>
  );
};

export default Payment;

const CalendarModal = ({idToken, exportLink, status, handleCloseModal, setModalVisible}) => {
  const dispatch = useDispatch();

  const [dates, setDates] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const rangePresets = [
    {label: "Last 1 month", value: [dayjs().subtract(1, "month"), dayjs()]},
    {label: "Last 3 months", value: [dayjs().subtract(3, "months"), dayjs()]},
    {label: "Last 6 months", value: [dayjs().subtract(6, "months"), dayjs()]},
    {label: "Last 1 year", value: [dayjs().subtract(1, "year"), dayjs()]},
    {label: "All time", value: [dayjs().subtract(20, "years"), dayjs()]},
  ];

  const onRangeChange = (dates) => {
    // setPageNo(1);
    if (dates) {
      setDates(dates.map((date) => date.format("YYYY-MM-DD")));
      console.log(dates);
    } else {
      setDates([]);
    }
  };

  const handleExport = () => {
    if (dates && dates?.length === 2) {
      const [startDate, endDate] = dates;
      let query = `?start_date=${startDate}&end_date=${endDate}&status=${status === "all" ? "" : status === "paid" ? 1 : 0}`;

      dispatch(paymentExportsReq({idToken, query, dispatch}))
        .unwrap()
        .then((response) => {
          const {s3_file_url, filename} = response?.data;
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

export const ExpandableRow = ({record}) => {
  const data = record?.meta_data ? JSON.parse(record?.meta_data) : null;
  return (
    <div className="paymentNestedTable">
      <div>
        <div>Name</div>
        <p>{record?.name || "-"}</p>
      </div>
      <div>
        <div>Payment Platform Status</div>
        <p>{record?.payment_platform_status || "-"}</p>
      </div>
      {data &&
        Object.keys(data)?.map((item) => (
          <div key={item}>
            <div>{item.replaceAll("_", " ")}</div>
            <p>{data[item] !== undefined && data[item] !== null && data[item] !== "" ? String(data[item]) : "-"}</p>
          </div>
        ))}
    </div>
  );
};
