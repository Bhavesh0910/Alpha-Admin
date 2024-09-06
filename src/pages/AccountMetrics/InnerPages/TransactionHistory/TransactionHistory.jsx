import React, { useEffect, useState } from 'react'
import './TransactionHistory.scss'
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactionHistory } from '../../../../store/NewReducers/amSlice';
import AntTable from '../../../../ReusableComponents/AntTable/AntTable';
import dayjs from 'dayjs';
import { dollarUS, formatValue } from '../../../../utils/helpers/string';

function TransactionHistory() {
    const [pageSize, setPageSize] = useState(20);
    const [pageNo, setPageNo] = useState(1);
    const idToken = useSelector((state) => state.auth.idToken);
    const dispatch = useDispatch();
    const { transactionHistory, isLoading, error } = useSelector((state) => state.accountMetrics);
  
    useEffect(() => {
      dispatch(fetchTransactionHistory({ idToken }))
    }, [dispatch]);

    const columns = [
        {
          title: 'Payment ID',
          dataIndex: 'payment_id',
          key: 'payment_id',
          width: 150,
          render: (text) => (text ? text : '-'),
        },
        {
          title: 'Transaction ID',
          dataIndex: 'transaction_id',
          key: 'transaction_id',
          width: 150,
          render: (text) => (text ? text : '-'),
        },
        {
          title: 'Challenge',
          dataIndex: 'challenge',
          key: 'challenge',
          width: 100,
          render: (text) => (text ? text : '-'),
        },
        {
          title: 'Account Balance',
          dataIndex: 'Account_balance',
          key: 'Account_balance',
          width: 150,
          render: (text) => dollarUS(formatValue(text)),
        },
        {
          title: 'User ID',
          dataIndex: 'User_id',
          key: 'User_id',
          width: 100,
          render: (text) => (text ? text : '-'),
        },
        {
          title: 'Funding Evaluation',
          dataIndex: 'Funding_evaluation',
          key: 'Funding_evaluation',
          width: 150,
          render: (text) => (text ? text : '-'),
        },
        {
          title: 'Amount',
          dataIndex: 'amount',
          key: 'amount',
          width: 150,
          render: (text) => dollarUS(formatValue(text)),
        },
        {
          title: 'Invoice',
          dataIndex: 'invoice',
          key: 'invoice',
          width: 100,
          render: (text) => (text ? text : '-'),
        },
        {
          title: 'Payment Status',
          dataIndex: 'payment_status',
          key: 'payment_status',
          width: 120,
          render: (text) => {
            let statusClass = "";
            switch (text) {
              case "Expired":
                statusClass = "status_red";
                break;
              case "Pending":
                statusClass = "status_yellow";
                break;
              case "succeeded":
                statusClass = "status_green";
                break;
              case "Payment Pending":
                statusClass = "status_yellow";
                break;
              default:
                break;
            }
            return <div className={`status_btn ${statusClass}`}>{text || "-"}</div>;       
        }
        },
        {
          title: 'Promo',
          dataIndex: 'promo',
          key: 'promo',
          width: 100,
          render: (text) => (text ? text : '-'),
        },
        {
          title: 'Date',
          dataIndex: 'date',
          key: 'date',
          width: 150,
          render: (text) => (text ? dayjs(text).format('YYYY-MM-DD') : '-'),
        },
        {
          title: 'Account Login ID',
          dataIndex: 'account_login_id',
          key: 'account_login_id',
          width: 150,
          render: (text) => (text ? text : '-'),
        },
        {
          title: 'Payment Type',
          dataIndex: 'payment_type',
          key: 'payment_type',
          width: 120,
          render: (text) => (text ? text : '-'),
        },
        {
          title: 'Meta Data',
          dataIndex: 'meta_data',
          key: 'meta_data',
          width: 200,
          render: (text) => {
            try {
              const parsedData = JSON.parse(text);
              return (
                <div>
                  {Object.entries(parsedData).map(([key, value]) => (
                    <div key={key}>
                      {key}: {String(value)}
                    </div>
                  ))}
                </div>
              );
            } catch {
              return '-';
            }
          },
        },
      ];
      function triggerChange(page, updatedPageSize) {
        setPageNo(page);
        setPageSize(updatedPageSize);
      }
    
      return (
        <div className="transaction_history">
          <AntTable
            columns={columns || []}
            data={transactionHistory}
            totalPages={Math.ceil(transactionHistory?.length / pageSize)}
            totalItems={transactionHistory?.length}
            pageSize={pageSize}
            CurrentPageNo={pageNo}
            setPageSize={setPageSize}
            triggerChange={triggerChange}
          />
        </div>
      );
    };

export default TransactionHistory