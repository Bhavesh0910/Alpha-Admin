// import React, { useState } from "react";
// import { Button, Table, Modal } from "antd";
// import "./TraderOverviewTable.scss";

// function TraderOverviewTable({ data, highlightText, searchText }) {
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [selectedTrader, setSelectedTrader] = useState(null);

//   console.log(data);
//   const columns = [
//     {
//       title: "Account Name",
//       dataIndex: "account_name",
//       key: "account_name",
//       width: 150,
//       render: (text) => highlightText(text, searchText),
//     },
//     {
//       title: "Account Type",
//       dataIndex: "account_type",
//       key: "account_type",
//       width: 150,
//       render: (text) => highlightText(text, searchText),
//     },
//     {
//       title: "Email",
//       dataIndex: "email",
//       key: "email",
//       width: 200,
//       render: (text) => highlightText(text, searchText),
//     },
//     {
//       title: "Active",
//       dataIndex: "is_active",
//       key: "is_active",
//       width: 100,
//       render: (isActive) => <span>{isActive ? "Active" : "Inactive"}</span>,
//     },
//     {
//       title: "Disqualified",
//       dataIndex: "is_disqualified",
//       key: "is_disqualified",
//       width: 120,
//       render: (isDisqualified) => <span>{isDisqualified ? "Yes" : "No"}</span>,
//     },
//     {
//       title: "Login ID",
//       dataIndex: "login_id",
//       key: "login_id",
//       width: 100,
//       render: (text) => highlightText(text, searchText),
//     },
//     {
//       title: "Name",
//       dataIndex: "name",
//       key: "name",
//       width: 150,
//       render: (text) => highlightText(text, searchText),
//     },
//     {
//       title: "Phase",
//       dataIndex: "phase",
//       key: "phase",
//       width: 150,
//       render: (text) => highlightText(text, searchText),
//     },
//     {
//       title: "Starting Balance",
//       dataIndex: "starting_balance",
//       key: "starting_balance",
//       width: 150,
//       render: (startingBalance) => (
//         <span>${parseFloat(startingBalance).toLocaleString()}</span>
//       ),
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       key: "status",
//       width: 150,
//       render: (text) => highlightText(text, searchText),
//     },
//     {
//       title: "Trading Platform",
//       dataIndex: "trading_platform",
//       key: "trading_platform",
//       width: 150,
//       render: (text) => highlightText(text, searchText),
//     },
//     {
//       title: "Action",
//       dataIndex: "action",
//       key: "action",
//       width: 200,
//       render: (_, record) => (
//         <div className="btn-wrapper">
//           <Button className="btn-block" onClick={() => handleBlock(record)}>
//             Block
//           </Button>
//           <Button className="btn-delete" danger>
//             Delete
//           </Button>
//         </div>
//       ),
//     },
//   ];

//   const handleBlock = (record) => {
//     setSelectedTrader(record);
//     showModal();
//   };

//   const showModal = () => {
//     setIsModalVisible(true);
//   };

//   const handleCancel = () => {
//     setIsModalVisible(false);
//   };

//   return (
//     <>
//       <Table
//         columns={columns}
//         dataSource={data}
//         pagination={{ pageSize: 10 }}
//         scroll={{ y: 600 }}
//       />
//       <Modal
//         title={`Block Account`}
//         visible={isModalVisible}
//         onCancel={handleCancel}
//         centered
//         className="table-modal"
//         footer={[
//           <div className="modal-btns-wrapper">
//             <Button className="cancel-btn" key="cancel" onClick={handleCancel}>
//               Cancel
//             </Button>
//             <Button
//               className="standard_button block_btn"
//               key="block"
//               type="primary"
//               danger
//               onClick={handleCancel}
//             >
//               Block
//             </Button>
//           </div>,
//         ]}
//       >
//         <div className="modal-content">
//           <p className="modal-title">Write Your Reason</p>
//           <textarea placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."></textarea>
//         </div>
//       </Modal>
//     </>
//   );
// }

// export default TraderOverviewTable;
