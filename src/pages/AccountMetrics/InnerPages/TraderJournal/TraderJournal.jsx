import React, { useEffect, useState } from "react";
import { Table, Button } from "antd";
import "./TraderJournal.scss";
import AntTable from "../../../../ReusableComponents/AntTable/AntTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchTradeJournal } from "../../../../store/NewReducers/amSlice";

const TraderJournal = ({ login_id, platform }) => {
  const [pageSize, setPageSize] = useState(20);
  const [pageNo, setPageNo] = useState(1);
  const idToken = useSelector((state) => state.auth.idToken);
  const dispatch = useDispatch();
  const { tradeJournal, isLoading, error } = useSelector(
    (state) => state.accountMetrics
  );

  useEffect(() => {
    dispatch(fetchTradeJournal({ login_id, platform, idToken }));
  }, [dispatch, login_id, platform, idToken]);

  console.log(tradeJournal);

  const columns = [
    {
      title: "Login",
      dataIndex: "login",
      key: "login",
      width:50,
    },
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
      width:70,
    },
    {
      title: "Symbol",
      dataIndex: "symbol",
      key: "symbol",
      width:70,
    },
    {
      title: "Date Opened",
      dataIndex: "dateOpen",
      key: "dateOpen",
      width:70,
    },
    {
      title: "Date Closed",
      dataIndex: "dateClose",
      key: "dateClose",
      width:70,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width:70,
    },
    {
      title: "Profit",
      dataIndex: "profitSum",
      key: "profitSum",
      width:70,
      render: (text) => `$${text.toFixed(2)}`, // Format profit with dollar sign
    },
    {
      title: "Commission",
      dataIndex: "commissionSum",
      key: "commissionSum",
      width:105,
    },
    {
      title: "Swap",
      dataIndex: "swapSum",
      key: "swapSum",
      width:65,
    },
    {
      title: "Volume Buy",
      dataIndex: "volumeSumBuy",
      key: "volumeSumBuy",
      width:80,
    },
    {
      title: "Volume Sell",
      dataIndex: "volumeSumSell",
      key: "volumeSumSell",
      width:80,
    },
    {
      title: "Average Buy Price",
      dataIndex: "priceAvgBuy",
      key: "priceAvgBuy",
      width:80,
      render: (text) => `$${text.toFixed(2)}`, // Format price with dollar sign
    },
    {
      title: "Average Sell Price",
      dataIndex: "priceAvgSell",
      key: "priceAvgSell",
      width:60,
      render: (text) => `$${text.toFixed(2)}`, // Format price with dollar sign
    },
    {
      title: "Stop Loss",
      dataIndex: "stopLoss",
      key: "stopLoss",
      width:60,
      render: (text) => (text !== null ? `$${text.toFixed(2)}` : '-'),
    },
    {
      title: "Take Profit",
      dataIndex: "takeProfit",
      key: "takeProfit",
      width:60,
      render: (text) => (text !== null ? `$${text.toFixed(2)}` : '-'),
    },
 
  ];

  const handleDelete = (id) => {
    console.log("Delete row with id:", id);
  };

  let data = [];
  if (tradeJournal) {
    data = Object.values(tradeJournal).flatMap(tradeDate =>
      tradeDate.trades.map(trade => ({
        login: trade.login,
        position: trade.position,
        symbol: trade.symbol,
        dateOpen: new Date(trade.dateOpen).toLocaleString(),
        dateClose: new Date(trade.dateClose).toLocaleString(),
        action: trade.action,
        profitSum: trade.profitSum,
        commissionSum: trade.commissionSum,
        swapSum: trade.swapSum,
        volumeSumBuy: trade.volumeSumBuy,
        volumeSumSell: trade.volumeSumSell,
        priceAvgBuy: trade.priceAvgBuy,
        priceAvgSell: trade.priceAvgSell,
        stopLoss: trade.stopLoss,
        takeProfit: trade.takeProfit,
      }))
    );
  }

  function triggerChange(page, updatedPageSize) {
    setPageNo(page);
    setPageSize(updatedPageSize);
  }

  return (
    <div className="trader_journal_main">
      <AntTable columns={columns} data={data}
         totalPages={Math.ceil(data?.length / pageSize)}
         totalItems={data?.length}
         pageSize={pageSize}
         CurrentPageNo={pageNo}
         setPageSize={setPageSize}
         triggerChange={triggerChange}
      />
    </div>
  );
};

export default TraderJournal;
