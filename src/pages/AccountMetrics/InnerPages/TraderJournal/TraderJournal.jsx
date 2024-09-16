import React, { useEffect, useMemo, useState } from "react";
import { Table, Button } from "antd";
import "./TraderJournal.scss";
import AntTable from "../../../../ReusableComponents/AntTable/AntTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchTradeJournal } from "../../../../store/NewReducers/amSlice";
import dayjs from "dayjs";

const TraderJournal = ({ login_id, platform }) => {
  const [pageSize, setPageSize] = useState(20);
  const [pageNo, setPageNo] = useState(1);
  const idToken = useSelector((state) => state.auth.idToken);
  const dispatch = useDispatch();
  const { tradeJournal, isLoading, error } = useSelector((state) => state.accountMetrics);

  useEffect(() => {
    dispatch(fetchTradeJournal({ login_id, platform, idToken }));
  }, [dispatch, login_id, platform, idToken]);

  console.log(tradeJournal);

  const columns = useMemo(() => [
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 80,
    },
    {
      title: "Commission Sum",
      dataIndex: "commissionSum",
      key: "commissionSum",
      width: 120,
      render: (text) => `$${(Number(text) || 0).toFixed(2)}`, 
    },
    {
      title: "Date Open",
      dataIndex: "dateOpen",
      key: "dateOpen",
      width: 150,
      render: (text) => text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '-', 
    },
    {
      title: "Date Close",
      dataIndex: "dateClose",
      key: "dateClose",
      width: 150,
      render: (text) => text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '-', 
    },
    {
      title: "Login",
      dataIndex: "login",
      key: "login",
      width: 100,
      render: (text) => (Number(text) || '-'),
    },
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
      width: 100,
      render: (text) => (Number(text) || '-'),
    },
    {
      title: "Price Avg Buy",
      dataIndex: "priceAvgBuy",
      key: "priceAvgBuy",
      width: 120,
      render: (text) => `$${(Number(text) || 0).toFixed(2)}`,
    },
    {
      title: "Price Avg Sell",
      dataIndex: "priceAvgSell",
      key: "priceAvgSell",
      width: 120,
      render: (text) => `$${(Number(text) || 0).toFixed(2)}`, 
    },
    {
      title: "Profit Sum",
      dataIndex: "profitSum",
      key: "profitSum",
      width: 120,
      render: (text) => `$${(Number(text) || 0).toFixed(2)}`, 
    },
    {
      title: "Stop Loss",
      dataIndex: "stopLoss",
      key: "stopLoss",
      width: 120,
      render: (text) => (text !== null && text !== undefined ? `$${(Number(text) || 0).toFixed(2)}` : '-'), 
    },
    {
      title: "Swap Sum",
      dataIndex: "swapSum",
      key: "swapSum",
      width: 120,
      render: (text) => `$${(Number(text) || 0).toFixed(2)}`, 
    },
    {
      title: "Volume Sum Buy",
      dataIndex: "volumeSumBuy",
      key: "volumeSumBuy",
      width: 120,
      render: (text) => `$${(Number(text) || 0).toFixed(2)}`, 
    },
    {
      title: "Volume Sum Sell",
      dataIndex: "volumeSumSell",
      key: "volumeSumSell",
      width: 120,
      render: (text) => `$${(Number(text) || 0).toFixed(2)}`, 
    },
    {
      title: "Symbol",
      dataIndex: "symbol",
      key: "symbol",
      width: 100,
    },
    {
      title: "Take Profit",
      dataIndex: "takeProfit",
      key: "takeProfit",
      width: 120,
      render: (text) => (text !== null && text !== undefined ? `$${(Number(text) || 0).toFixed(2)}` : '-'),
    },
  ], []);

  let data = [];
  if (tradeJournal) {
    data = Object.values(tradeJournal).flatMap((dateEntry) =>
      dateEntry.trades.map((trade) => ({
        action: trade?.action ?? "-",
        commissionSum: trade?.commissionSum ?? 0,
        dateOpen: trade?.dateOpen ?? null,
        dateClose: trade?.dateClose ?? null,
        login: trade?.login ?? "-",
        position: trade?.position ?? "-",
        priceAvgBuy: trade?.priceAvgBuy ?? 0,
        priceAvgSell: trade?.priceAvgSell ?? 0,
        profitSum: trade?.profitSum ?? 0,
        stopLoss: trade?.stopLoss ?? null,
        swapSum: trade?.swapSum ?? 0,
        symbol: trade?.symbol ?? "-",
        takeProfit: trade?.takeProfit ?? null,
        volumeSumBuy: trade?.volumeSumBuy ?? 0,
        volumeSumSell: trade?.volumeSumSell ?? 0,
      })),
    );
  }

  console.log(data)

  function triggerChange(page, updatedPageSize) {
    setPageNo(page);
    setPageSize(updatedPageSize);
  }

  return (
    <div className="trader_journal_main">
      <AntTable
        columns={columns}
        data={data}
        totalPages={Math.ceil(data.length / pageSize)}
        totalItems={data.length}
        pageSize={pageSize}
        CurrentPageNo={pageNo}
        setPageSize={setPageSize}
        triggerChange={triggerChange}
      />
    </div>
  );
};

export default TraderJournal;
