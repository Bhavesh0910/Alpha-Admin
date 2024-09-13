import React, { useEffect, useMemo, useState } from "react";
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
  const { tradeJournal, isLoading, error } = useSelector((state) => state.accountMetrics);

  useEffect(() => {
    dispatch(fetchTradeJournal({ login_id, platform, idToken }));
  }, [dispatch, login_id, platform, idToken]);

  console.log(tradeJournal);

  const columns = useMemo(() => [
    {
      title: "Login",
      dataIndex: "login",
      key: "login",
      width: 50,
    },
    {
      title: "Position ID",
      dataIndex: "positionId",
      key: "positionId",
      width: 80,
    },
    {
      title: "Symbol",
      dataIndex: "symbol",
      key: "symbol",
      width: 80,
    },
    {
      title: "Direction",
      dataIndex: "direction",
      key: "direction",
      width: 70,
    },
    {
      title: "Open Timestamp",
      dataIndex: "openTimestamp",
      key: "openTimestamp",
      width: 150,
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Close Timestamp",
      dataIndex: "closeTimestamp",
      key: "closeTimestamp",
      width: 150,
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Entry Price",
      dataIndex: "entryPrice",
      key: "entryPrice",
      width: 100,
      render: (text) => `$${(Number(text) || 0).toFixed(2)}`,
    },
    {
      title: "Close Price",
      dataIndex: "closePrice",
      key: "closePrice",
      width: 100,
      render: (text) => `$${(Number(text) || 0).toFixed(2)}`,
    },
    {
      title: "P&L",
      dataIndex: "pnl",
      key: "pnl",
      width: 70,
      render: (text) => `$${(Number(text) || 0).toFixed(2)}`,
    },
    {
      title: "Commission",
      dataIndex: "commission",
      key: "commission",
      width: 100,
      render: (text) => `$${(Number(text) || 0).toFixed(2)}`,
    },
    {
      title: "Swap",
      dataIndex: "swap",
      key: "swap",
      width: 100,
      render: (text) => `$${(Number(text) || 0).toFixed(2)}`,
    },
    {
      title: "Volume",
      dataIndex: "volume",
      key: "volume",
      width: 80,
      render: (text) => (Number(text) || 0).toFixed(2),
    },
    {
      title: "Stake",
      dataIndex: "stake",
      key: "stake",
      width: 80,
      render: (text) => (Number(text) || 0).toFixed(2),
    },
  ], []);

  const handleDelete = (id) => {
    console.log("Delete row with id:", id);
  };

  let data = [];
  if (tradeJournal) {
    data = Object.values(tradeJournal).flatMap((dateEntry) =>
      dateEntry.trades.map((trade) => ({
        login: trade?.login ?? "-",
        positionId: trade?.positionId ?? "-",
        symbol: trade?.symbol ?? "-",
        direction: trade?.direction ?? "-",
        openTimestamp: trade?.openTimestamp ?? "-",
        closeTimestamp: trade?.closeTimestamp ?? "-",
        entryPrice: trade?.entryPrice ?? 0,
        closePrice: trade?.closePrice ?? 0,
        pnl: trade?.pnl ?? 0,
        commission: trade?.commission ?? 0,
        swap: trade?.swap ?? 0,
        volume: trade?.volume ?? 0,
        stake: trade?.stake ?? 0,
      })),
    );
  }

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
