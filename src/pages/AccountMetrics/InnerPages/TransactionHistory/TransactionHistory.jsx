import React, { useEffect, useState } from 'react';
import './TransactionHistory.scss';
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
        dispatch(fetchTransactionHistory({ idToken }));
    }, [dispatch, idToken]);

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
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
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
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            width: 150,
            render: (text) => (text ? dayjs(text).format('YYYY-MM-DD') : '-'),
        },
        {
            title: 'Payment Status',
            dataIndex: 'payment_status',
            key: 'payment_status',
            width: 120,
            render: (text) => {
                let statusClass = '';
                switch (text) {
                    case 'Expired':
                        statusClass = 'status_red';
                        break;
                    case 'Pending':
                        statusClass = 'status_yellow';
                        break;
                    case 'succeeded':
                        statusClass = 'status_green';
                        break;
                    case 'Payment Pending':
                        statusClass = 'status_yellow';
                        break;
                    default:
                        statusClass = 'status_yellow';
                        break;
                }
                return <div style={{textTransform:'capitalize'}} className={`status_btn ${statusClass}`}>{text === 'Payment Pending' ? "Pending" :  text || '-'}</div>;
            },
        },
        {
            title: 'Payment Type',
            dataIndex: 'payment_type',
            key: 'payment_type',
            width: 120,
            render: (text) => (text ? text : '-'),
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
                isExpandable={true}
                ExpandedComp={ExpandedRowRender}
                rowId="payment_id"
                scrollY={460}
            />
        </div>
    );
}

const ExpandedRowRender = ({ record }) => {
    return (
        <div className="expanded-row-content">
            <p>
                <strong>Challenge:</strong> {record.challenge || '-'}
            </p>
            <p>
                <strong>Account Balance:</strong> {dollarUS(formatValue(record.Account_balance)) || '-'}
            </p>
            <p>
                <strong>Funding Evaluation:</strong> {record.Funding_evaluation || '-'}
            </p>
            <p>
            <strong>Invoice: </strong> 
            {record?.invoice !== "N/A" ? 
      <a href={record?.invoice} target="_blank" rel="noopener noreferrer">
         View 
      </a>   : '-' }         </p>
            <p>
                <strong>Promo:</strong> {record.promo || '-'}
            </p>
            <p>
            {parseMetaData(record.meta_data)}
            </p>
        </div>
    );
};

const parseMetaData = (metaData) => {
    try {
        const parsedData = JSON.parse(metaData);
        return (
            <div>
                {Object.entries(parsedData).map(([key, value]) => (
                    <div key={key}>
                        <strong>{key}</strong>: {String(value)}
                    </div>
                ))}
            </div>
        );
    } catch {
        return '-';
    }
};

export default TransactionHistory;
