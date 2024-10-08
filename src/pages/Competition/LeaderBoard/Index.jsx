import React, {useEffect, useMemo} from "react";
import Cards from "../../../components/Competition/Cards";
import DashBoardChart from "../../../components/Competition/DashBoardChart";
import CurrentWinner from "../../../components/Competition/CurrentWinner";
import "./style.scss";
import AntTable from "../../../ReusableComponents/AntTable/AntTable";
import {Button} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {fetchCompDashboard, fetchCompTableDetails} from "../../../store/NewReducers/competitionSlice";
import {useLocation, useParams} from "react-router";
import {getCompDashboardChart} from "../../../utils/api/apis";
import moment from "moment";
import LoaderOverlay from "../../../ReusableComponents/LoaderOverlay";

const LeaderBoard = () => {
  const {idToken} = useSelector((state) => state.auth);
  const {compTableData, compDashboard, isLoading} = useSelector((state) => state.comp);
  const {id} = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchCompTable();
  }, []);
  const fetchCompTable = () => {
    dispatch(fetchCompTableDetails({idToken, id}));
  };

  const handleStatsandCharts = (compId) => {
    dispatch(fetchCompDashboard({idToken, id: compId}));
  };

  const columns = useMemo(() => {
    return [
      {
        title: "#",
        dataIndex: "rank",
        key: "rank",
        width: 100,
        render: (text) => (text ? text : "-"),
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        width: 100,
        render: (text) => (text ? text : "-"),
      },
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
        width: 100,
        render: (text) => (text ? moment(text).format("DD/MM/YYYY") : "-"),
      },
      {
        title: "Account Balance",
        dataIndex: "latest_balance",
        key: "latest_balance",
        width: 100,
        render: (text) => (text ? `$${text}` : "-"),
      },
      {
        title: "Status",
        dataIndex: "is_disqualified",
        key: "is_disqualified",
        width: 100,
        render: (text) => (text === false ? "Active" : "Inactive"),
      },
      {
        title: "Price Won",
        dataIndex: "price_won",
        key: "price_won",
        width: 100,
        render: (text) => (text ? text : "-"),
      },
      {
        title: "",
        dataIndex: "action",
        key: "action",
        width: 100,
        render: (text, record) => (
          <Button
            type="primary"
            onClick={() => handleStatsandCharts(record?.id)}
          >
            View Details
          </Button>
        ),
      },
    ];
  });

  return (
    <div className="leaderboard_wrapper">
      {isLoading && <LoaderOverlay />}
      <Cards />
      <div className="leaderboard_middle_content">
        <DashBoardChart />
        <CurrentWinner />
      </div>
      <AntTable
        columns={columns}
        data={compTableData || []}
        serverSide={false}
      />
    </div>
  );
};

export default LeaderBoard;
