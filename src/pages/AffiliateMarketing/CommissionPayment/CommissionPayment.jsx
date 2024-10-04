import React, { useEffect, useState } from "react";
import { Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import "./CommissionPayment.scss";
import { fetchCommissionPaymentData } from "../../../store/NewReducers/affiliateSlice"; // Update this path as necessary
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import LoaderOverlay from "../../../ReusableComponents/LoaderOverlay";
import dayjs from "dayjs";

const CommissionPayment = ({ id }) => {
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(20);
  const [pageNo, setPageNo] = useState(1);
  const dispatch = useDispatch();
  const { commissionPaymentData, codes ,  isLoading, totalCount } = useSelector((state) => state.affiliate);
  const { idToken } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchCommissionPaymentData({ idToken, affiliateId: id, pageNo, pageSize, searchText }));
  }, [dispatch, pageNo, pageSize, searchText, idToken, id]);

  

  const columns = [
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => (text ? dayjs(text).format('DD/MMM/YYYY') : "-"),
      width:100
    },
    {
      title: "Email",
      dataIndex: "affiliate_email",
      key: "affiliate_email",
      render: (text) => text || "-",
    },
    {
      title: "Commission Percentage",
      dataIndex: "commission_percentage",
      key: "commission_percentage",
      render: (text) => (text !== undefined ? `${text}%` : "-"),
      width: 120
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text) => (text !== undefined ? `$${text}` : "-"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => text || "-",
    },
    {
        title: "Referred Trader",
        dataIndex: "refered_trader",
        key: "refered_trader",
        render: (text) => (text !== null ? text : "-"),
      },
      {
        title: "Payment ID",
        dataIndex: ["payment", "payment_id"],
        key: "payment_id",
        render: (text) => text || "-",
      },
  ];

  const handleSearch = (value) => {
    setSearchText(value);
    setPageNo(1); // Reset to the first page on search
  };

  return (
    <div className="commission_payment">
      <div className="header_wrapper">
        {/* <h3 className="page_header">Commission Payments</h3> */}
      </div>
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
          data={commissionPaymentData || []}
          columns={columns}
          totalPages={Math.ceil(commissionPaymentData?.length / pageSize)}
          totalItems={commissionPaymentData?.length}
          pageSize={pageSize}
          CurrentPageNo={pageNo}
          setPageSize={setPageSize}
          triggerChange={setPageNo}
          scrollY={400}
        />
      )}
    </div>
  );
};

export default CommissionPayment;
