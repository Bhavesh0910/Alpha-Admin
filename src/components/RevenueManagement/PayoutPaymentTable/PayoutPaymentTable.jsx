import React, {useEffect, useMemo, useState} from "react";
import "./PayoutPaymentTable.scss";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import {Button, notification, Tooltip} from "antd";
import {paymentListReq, payoutListReq} from "../../../store/NewReducers/payment";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import moment from "moment";

const PayoutPaymentTable = ({activeTab}) => {
  const [pageSize, setPageSize] = useState(20);
  const [pageNo, setPageNo] = useState(1);

  const {idToken, searchDates} = useSelector((state) => state.auth);
  const {paymentData, isLoading, payoutData} = useSelector((state) => state.payment);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const paymentColumns = useMemo(
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
                    // icon={<CopyButton />}
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
                    // icon={<CopyButton />}
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
                    // icon={<CopyButton />}
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
        render: (amount) => <span>${amount}</span>,
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
    ],
    [paymentData],
  );

  const payoutColumns = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
        width:100,
        render: (text) => text || "-",
      },
      {
        title: "Amount",
        dataIndex: "amount",
        key: "amount",
        width:100,
        render: (text) => (text !== null && text !== undefined ? text : "-"),
      },
      {
        title: "Country",
        dataIndex: "country",
        key: "country",
        width:100,
        render: (text) => text || "-",
      },
      {
        title: "Created At",
        dataIndex: "created_at",
        key: "created_at",
        width:120,
        render: (text) => text || "-",
      },
      {
        title: "Invoice",
        dataIndex: "invoice",
        key: "invoice",
        width:100,
        render: (text) => (
          <>
            {text ? (
              <a
                href={text}
                target="_blank"
              >
                <Button>Invoice</Button>
              </a>
            ) : (
              <Button>-</Button>
            )}
          </>
        ),
      },
      {
        title: "KYC",
        dataIndex: "kyc",
        key: "kyc",
        width:100,
        render: (text) => (text !== null && text !== undefined ? (text ? "Yes" : "No") : "-"),
      },
      {
        title: "Login ID",
        dataIndex: "login_id",
        key: "login_id",
        width:100,
        render: (text) => text || "-",
      },
      {
        title: "Method",
        dataIndex: "method",
        key: "method",
        width:100,
        render: (text) => text || "-",
      },
      {
        title: "Performance Bonus",
        dataIndex: "performance_bonus",
        key: "performance_bonus",
        width:110,
        render: (text) => (text !== null && text !== undefined ? text : "-"),
      },
      {
        title: "Profit Split",
        dataIndex: "profit_split",
        key: "profit_split",
        width:100,
        render: (text) => (text !== null && text !== undefined ? text : "-"),
      },
      {
        title: "Reason",
        dataIndex: "reason",
        key: "reason",
        width:100,
        render: (text) => text || "-",
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width:100,
        render: (text) => text || "-",
      },
      {
        title: "User Email",
        dataIndex: "user_email",
        key: "user_email",
        width:100,
        render: (text) => text || "-",
      },
      {
        title: "User Name",
        dataIndex: "user_name",
        key: "user_name",
        width:100,
        render: (text) => text || "-",
      },
    ],
    [paymentData],
  );

  useEffect(() => {
    if (activeTab === "payments") {
      fetchPayments(idToken, pageSize, pageNo);
    } else {
      fetchPayouts(idToken, pageSize, pageNo);
    }
  }, [idToken, pageSize, pageNo, activeTab]);

  function fetchPayments(idToken, pageSize, pageNo) {
    let query = `?page=${pageNo || 1}&page_size=${pageSize || 20}&status=${activeTab === "paid" ? 1 : activeTab === "unpaid" ? 0 : ""}`;

    dispatch(paymentListReq({idToken, query, dispatch}));
  }

  function fetchPayouts(idToken, pageSize, pageNo) {
    let query = `?page=${pageNo || 1}&page_size=${pageSize || 20}`;

    dispatch(payoutListReq({idToken, query, dispatch}));
  }

  function triggerChange(page, updatedPageSize) {
    setPageNo(page);
    setPageSize(updatedPageSize);
  }

  console.log("payment data : ", paymentData , payoutData);

  return (
      <AntTable
        data={activeTab === "payments" ? paymentData?.results || [] : payoutData?.results || []}
        columns={activeTab === "payments" ? paymentColumns : payoutColumns}
        totalPages={activeTab === "payments" ? Math.ceil((paymentData?.count || 0) / pageSize) : Math.ceil((payoutData?.count || 0) / pageSize)}
        totalItems={activeTab === "payments" ? paymentData?.count || 0 : payoutData?.count || 0}
        pageSize={pageSize}
        CurrentPageNo={pageNo}
        setPageSize={setPageSize}
        triggerChange={triggerChange}
      />
    );
    
};

export default PayoutPaymentTable;
