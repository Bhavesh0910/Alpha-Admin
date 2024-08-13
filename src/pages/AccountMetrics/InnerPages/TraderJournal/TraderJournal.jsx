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
    },
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
    },
    {
      title: "Symbol",
      dataIndex: "symbol",
      key: "symbol",
    },
    {
      title: "Date Opened",
      dataIndex: "dateOpen",
      key: "dateOpen",
    },
    {
      title: "Date Closed",
      dataIndex: "dateClose",
      key: "dateClose",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
    },
    {
      title: "Profit",
      dataIndex: "profitSum",
      key: "profitSum",
      render: (text) => `$${text.toFixed(2)}`, // Format profit with dollar sign
    },
    {
      title: "Commission",
      dataIndex: "commissionSum",
      key: "commissionSum",
    },
    {
      title: "Swap",
      dataIndex: "swapSum",
      key: "swapSum",
    },
    {
      title: "Volume Buy",
      dataIndex: "volumeSumBuy",
      key: "volumeSumBuy",
    },
    {
      title: "Volume Sell",
      dataIndex: "volumeSumSell",
      key: "volumeSumSell",
    },
    {
      title: "Average Buy Price",
      dataIndex: "priceAvgBuy",
      key: "priceAvgBuy",
      render: (text) => `$${text.toFixed(2)}`, // Format price with dollar sign
    },
    {
      title: "Average Sell Price",
      dataIndex: "priceAvgSell",
      key: "priceAvgSell",
      render: (text) => `$${text.toFixed(2)}`, // Format price with dollar sign
    },
    {
      title: "Stop Loss",
      dataIndex: "stopLoss",
      key: "stopLoss",
      render: (text) => (text !== null ? `$${text.toFixed(2)}` : '-'),
    },
    {
      title: "Take Profit",
      dataIndex: "takeProfit",
      key: "takeProfit",
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
         totalPages={Math.ceil(data?.no_of_trades / pageSize)}
         totalItems={data?.no_of_trades}
         pageSize={pageSize}
         CurrentPageNo={pageNo}
         setPageSize={setPageSize}
         triggerChange={triggerChange}
      />
    </div>
  );
};

export default TraderJournal;
