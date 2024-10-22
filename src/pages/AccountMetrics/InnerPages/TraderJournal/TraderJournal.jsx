import React, {useEffect, useMemo, useState} from "react";
import {Table, Button} from "antd";
import "./TraderJournal.scss";
import AntTable from "../../../../ReusableComponents/AntTable/AntTable";
import {useDispatch, useSelector} from "react-redux";
import {fetchTradeJournal} from "../../../../store/NewReducers/amSlice";
import dayjs from "dayjs";
import {dollarUS} from "../../../../utils/helpers/string";

const TraderJournal = ({login_id, platform}) => {
  const [pageSize, setPageSize] = useState(20);
  const [pageNo, setPageNo] = useState(1);
  const idToken = useSelector((state) => state.auth.idToken);
  const dispatch = useDispatch();
  const {tradeJournal, isLoading, error, tradingAccountOverview} = useSelector((state) => state.accountMetrics);

  useEffect(() => {
    dispatch(fetchTradeJournal({login_id, platform, idToken}));
  }, [dispatch, login_id, platform, idToken]);

  console.log(tradeJournal);

  const columns = useMemo(
    () => [
      {
        title: "Time",
        dataIndex: "date",
        key: "time",
        width: 180,
        render: (text) => (text ? dayjs(text).format("YYYY-MM-DD HH:mm:ss") : "N/A"),
      },
      {
        title: "Deal",
        dataIndex: `${platform === "ctrader-accounts" ? "deal_id" : "deal"}`,
        key: "deal",
        width: 120,
        render: (text) => (text != null ? text : "N/A"),
      },
      {
        title: "Order",
        dataIndex: "order",
        key: "order",
        width: 120,
        render: (text) => (text != null ? text : "N/A"),
      },
      {
        title: "Position",
        dataIndex: "position",
        key: "position",
        width: 120,
        render: (text) => (text != null ? text : "N/A"),
      },
      {
        title: "Symbol",
        dataIndex: "symbol",
        key: "symbol",
        width: 100,
        render: (text) => (text ? text : "N/A"),
      },
      {
        title: "Type",
        dataIndex: "action",
        key: "type",
        width: 80,
        render: (text) => (text ? text : "Unknown"),
      },
      {
        title: "Entry",
        dataIndex: "entry",
        key: "entry",
        width: 80,
        render: (text) => (text ?? "N/A"),
      },
      {
        title: "Volume",
        dataIndex: "volume",
        key: "volume",
        width: 80,
        render: (text) => (text != null ? Number(text)?.toFixed(2) : "0.00"),
      },
      {
        title: "Price",
        dataIndex: "price",
        key: "price",
        width: 80,
        render: (text) => (text != null ? dollarUS(Number(text)?.toFixed(2) || 0) : "$0.00"),
      },
      {
        title: "S/L",
        dataIndex: "stopLoss",
        key: "sl",
        width: 120,
       render: (text) => dollarUS(Number(text ?? 0)?.toFixed(2)) || "N/A"
      },
      {
        title: "T/P",
        dataIndex: "takeProfit",
        key: "tp",
        width: 100,
         render: (text) => dollarUS(Number(text ?? 0)?.toFixed(2)) || "N/A"
      },
      {
        title: "Reason",
        dataIndex: "reason",
        key: "reason",
        width: 100,
        render: (text) => (text ? text : "No reason provided"),
      },
      {
        title: "Commission",
        dataIndex: "commission",
        key: "commission",
        width: 120,
        render: (text) => dollarUS(Number(text) || 0),
      },
      {
        title: "Swap",
        dataIndex: "swap",
        key: "swap",
        width: 80,
        render: (text) => dollarUS(Number(text) || 0),
      },
      {
        title: "Profit",
        dataIndex: "profit",
        key: "profit",
        width: 80,
        render: (text) => dollarUS(Number(text) || 0),
      },
      {
        title: "Comment",
        dataIndex: "comment",
        key: "comment",
        width: 120,
        render: (text) => (text ? text : "N/A"),
      },
    ],
    [],
  );

  function triggerChange(page, updatedPageSize) {
    setPageNo(page);
    setPageSize(updatedPageSize);
  }

  return (
    <div className="trader_journal_main">
      <AntTable
        columns={columns || []}
        data={tradingAccountOverview?.data || []}
        loading={isLoading}
        // totalPages={Math.ceil(tradingAccountOverview?.data ? tradingAccountOverview?.data?.length / pageSize : 0)}
        // totalItems={tradingAccountOverview?.data?.length || 0}
        // pageSize={pageSize}
        // CurrentPageNo={pageNo}
        // setPageSize={setPageSize}
        // triggerChange={triggerChange}
        serverSide={false}
      />
    </div>
  );
};

export default TraderJournal;
