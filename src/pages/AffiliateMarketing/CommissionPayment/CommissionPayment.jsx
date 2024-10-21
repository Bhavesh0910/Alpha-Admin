import React, {useEffect, useState} from "react";
import {Input} from "antd";
import {useDispatch, useSelector} from "react-redux";
import "./CommissionPayment.scss";
import {fetchCommissionPaymentData} from "../../../store/NewReducers/affiliateSlice"; // Update this path as necessary
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import LoaderOverlay from "../../../ReusableComponents/LoaderOverlay";
import dayjs from "dayjs";
import {ReactComponent as DownloadIcon} from "../../../assets/icons/download.svg";

const CommissionPayment = ({user_id}) => {
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [pageNo, setPageNo] = useState(1);
  const dispatch = useDispatch();
  const {commissionPaymentData, count, isLoading, totalItems} = useSelector((state) => state.affiliate);
  const {idToken} = useSelector((state) => state.auth);

  console.log(commissionPaymentData);
  useEffect(() => {
    dispatch(fetchCommissionPaymentData({idToken, affiliateId: user_id, pageNo, pageSize, searchText}));
  }, [dispatch, pageNo, pageSize, searchText, idToken, user_id]);

  const columns = [
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => (text ? dayjs(text).format("DD/MMM/YYYY") : "-"),
      width: 100,
    },
    {
      title: "Email",
      dataIndex: "refered_trader_email",
      key: "refered_trader_email",
      width: 100,
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Commission Percentage",
      dataIndex: "commission_percentage",
      key: "commission_percentage",
      render: (text) => (text !== undefined ? `${text}%` : "-"),
      width: 120,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 100,
      render: (text) => (text !== undefined ? `$${Number(text).toFixed(2)}` : "-"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (text) => (text ? text : "-"),
    },
    // {
    //   title: "Referred Trader",
    //   dataIndex: "refered_trader",
    //   key: "refered_trader",
    //   width: 100,
    //   render: (text) => (text !== null ? text : "-"),
    // },
    {
      title: "Payment ID",
      dataIndex: ["payment", "payment_id"],
      key: "payment_id",
      width: 100,
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Promo",
      dataIndex: "promo",
      key: "promo",
      width: 100,
      render: (text, record) => (record?.payment?.promo ? record?.payment?.promo : "-"),
    },
    {
      title: "Invoice",
      dataIndex: "invoice",
      key: "invoice",
      width: 100,
      render: (text, record) =>
        record?.payment?.invoice ? (
          <a
            href={record?.payment?.invoice}
            target="_blank"
            download
          >
            <DownloadIcon />
          </a>
        ) : (
          "-"
        ),
    },
  ];

  const handleSearch = (value) => {
    setSearchText(value);
    setPageNo(1); // Reset to the first page on search
  };

  function triggerChange(page, updatedPageSize) {
    setPageNo(page);
    setPageSize(updatedPageSize);
  }
  return (
    <div className="commission_payment">
      <div className="header_wrapper">{/* <h3 className="page_header">Commission Payments</h3> */}</div>
      {/* <div className="search_box_wrapper">
        <Input
          placeholder="Search by Email or Date..."
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          onPressEnter={() => handleSearch(searchText)}
        />
      </div> */}
      {isLoading ? (
        <LoaderOverlay />
      ) : (
        <AntTable
          data={commissionPaymentData?.results || []}
          columns={columns}
          totalPages={Math.ceil(commissionPaymentData?.count / pageSize)}
          totalItems={commissionPaymentData?.count || 0}
          pageSize={pageSize}
          CurrentPageNo={pageNo}
          setPageSize={setPageSize}
          triggerChange={triggerChange}
          scrollY={400}
          isExpandable={true}
          ExpandedComp={ExpandedRow}
          rowId={"id"}
        />
      )}
    </div>
  );
};

export default CommissionPayment;

export const ExpandedRow = ({record}) => {
  return (
    <div className="nestedTable">
      <div>
        <strong>Account Balance</strong>
        <p>{record?.payment?.Account_balance ? record?.payment?.Account_balance : "-"}</p>
      </div>
      <div>
        <strong>Funding Evaluation</strong>
        <p>{record?.payment?.Funding_evaluation ? record?.payment?.Funding_evaluation : "-"}</p>
      </div>
      <div>
        <strong>User ID</strong>
        <p>{record?.payment?.User_id ? record?.payment?.User_id : "-"}</p>
      </div>
      <div>
        <strong>Account Login ID</strong>
        <p>{record?.payment?.account_login_id ? record?.payment?.account_login_id : "-"}</p>
      </div>
      <div>
        <strong>Amount</strong>
        <p>{record?.payment?.amount ?  `$${Number(record?.payment?.amount/100).toFixed(2)}` : "-"}</p>
      </div>
      <div>
        <strong>Challenge</strong>
        <p>{record?.payment?.challenge ? record?.payment?.challenge : "-"}</p>
      </div>
      <div>
        <strong>Payment Status</strong>
        <p>{record?.payment?.payment_status ? record?.payment?.payment_status : "-"}</p>
      </div>
      <div>
        <strong>Payment Type</strong>
        <p>{record?.payment?.payment_type ? record?.payment?.payment_type : "-"}</p>
      </div>
      <div>
        <strong>Transaction ID</strong>
        <p>{record?.payment?.transaction_id ? record?.payment?.transaction_id : "-"}</p>
      </div>
    </div>
  );
};
