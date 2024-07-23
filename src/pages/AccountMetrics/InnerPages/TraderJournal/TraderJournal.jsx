import React, { useEffect } from "react";
import { Table, Button } from "antd";
import "./TraderJournal.scss";
import AntTable from "../../../../ReusableComponents/AntTable/AntTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchTradeJournal } from "../../../../store/NewReducers/amSlice";

const TraderJournal = ({ login_id, platform }) => {
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

  const handleDelete = (id) => {
    console.log("Delete row with id:", id);
  };


  let data;
  if (!tradeJournal || Object.keys(tradeJournal).length === 0) {
    data = []
  }
  // else{
  //   data = tradeJournal
  // }

  return (
    <div className="trader_journal_main">
      <AntTable columns={columns} data={data} pagination={{ pageSize: 10 }} />
    </div>
  );
};

export default TraderJournal;
