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

  console.log("payment data : ", paymentData);

  return (
    <AntTable
      data={activeTab === "payments" ? paymentData?.results || [] : payoutData || []}
      columns={columns}
      totalPages={Math.ceil(paymentData?.count / pageSize)}
      totalItems={paymentData?.count}
      pageSize={pageSize}
      CurrentPageNo={pageNo}
      setPageSize={setPageSize}
      triggerChange={triggerChange}
    />
  );
};

export default PayoutPaymentTable;
