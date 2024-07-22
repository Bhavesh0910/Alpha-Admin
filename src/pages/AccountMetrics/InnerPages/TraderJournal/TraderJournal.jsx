import React, { useEffect } from "react";
import {Table, Button} from "antd";
import "./TraderJournal.scss";
import AntTable from "../../../../ReusableComponents/AntTable/AntTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchTradeJournal } from "../../../../store/NewReducers/amSlice";

const TraderJournal = ({login_id , platform}) => {

  const idToken = useSelector((state) => state.auth.idToken);
  const dispatch = useDispatch();
  const {  tradeJournal , isLoading, error } = useSelector(state => state.accountMetrics);
  useEffect(() => {
    dispatch(fetchTradeJournal({ login_id , platform , idToken  }));
  }, [dispatch, login_id, platform, idToken]);


  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Symbol",
      dataIndex: "symbol",
      key: "symbol",
    },
    {
      title: "Lots",
      dataIndex: "lots",
      key: "lots",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Profit",
      dataIndex: "profit",
      key: "profit",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <Button
          type="danger"
          onClick={() => handleDelete(record.id)}
          className="delete_btn"
        >
          Delete
        </Button>
      ),
    },
  ];

  const dummyData = [
    {
      key: "1",
      id: 1360,
      symbol: "HK$",
      lots: 3.57,
      date: "9/23/16",
      price: "$816",
      profit: "$15.14",
    },
    {
      key: "2",
      id: 5460,
      symbol: "£",
      lots: 0.1,
      date: "1/15/12",
      price: "$274",
      profit: "$15.14",
    },
    {
      key: "3",
      id: 6600,
      symbol: "S$",
      lots: 4.53,
      date: "8/16/13",
      price: "$583",
      profit: "$15.14",
    },
    {
      key: "4",
      id: 1865,
      symbol: "AUD$",
      lots: 2.74,
      date: "9/4/12",
      price: "$185",
      profit: "$15.14",
    },
    {
      key: "5",
      id: 8767,
      symbol: "$",
      lots: 0.077,
      date: "7/27/13",
      price: "$423",
      profit: "$15.14",
    },
    {
      key: "6",
      id: 4692,
      symbol: "€",
      lots: 0.036,
      date: "8/30/14",
      price: "$994",
      profit: "$15.14",
    },
    {
      key: "7",
      id: 6666,
      symbol: "HK$",
      lots: 0.23,
      date: "4/21/12",
      price: "$922",
      profit: "$15.14",
    },
    {
      key: "8",
      id: 1966,
      symbol: "S$",
      lots: 1.85,
      date: "5/7/16",
      price: "$536",
      profit: "$15.14",
    },
    {
      key: "9",
      id: 8836,
      symbol: "£",
      lots: 130,
      date: "5/27/15",
      price: "$492",
      profit: "$15.14",
    },
    {
      key: "10",
      id: 4263,
      symbol: "CAD$",
      lots: 0.022,
      date: "10/6/13",
      price: "$826",
      profit: "$15.14",
    },
  ];

  const handleDelete = (id) => {
    console.log("Delete row with id:", id);
  };

  return (
    <div className="trader_journal_main">
      <AntTable
        columns={columns}
        data={dummyData}
        pagination={{pageSize: 10}}
      />
    </div>
  );
};

export default TraderJournal;
