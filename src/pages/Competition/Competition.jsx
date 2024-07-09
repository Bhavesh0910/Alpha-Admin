import { Button, Pagination } from "antd";
import React, { useState } from "react";
import threeDotsIcon from "../../assets/icons/menu_3dots_icon.svg";
import "./Competition.scss";
import { useNavigate } from "react-router-dom";

const Competition = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [pageSize, setPageSize] = useState(20);
  const [pageNo, setPageNo] = useState(1);
  const navigate = useNavigate();

  const handleTabChange = (key) => {
    setPageNo(1);
    setActiveTab(key);
  };

  const dummyData = {
    ended: [
      {
        competition_name: "May Competition",
        start_date: "Wed 1st May 2024 | 04:00 PM",
        end_date: "Tue 14th May 2024 | 09:00 AM",
        status: "ended",
        participants: 50,
        first_prize: "$100K Evaluation",
        second_prize: "$50K Evaluation",
        third_prize: "$25K Evaluation",
      },
      {
        competition_name: "May Competition",
        start_date: "Wed 1st May 2024 | 04:00 PM",
        end_date: "Tue 14th May 2024 | 09:00 AM",
        status: "ended",
        participants: 50,
        first_prize: "$100K Evaluation",
        second_prize: "$50K Evaluation",
        third_prize: "$25K Evaluation",
      },
      {
        competition_name: "May Competition",
        start_date: "Wed 1st May 2024 | 04:00 PM",
        end_date: "Tue 14th May 2024 | 09:00 AM",
        status: "ended",
        participants: 50,
        first_prize: "$100K Evaluation",
        second_prize: "$50K Evaluation",
        third_prize: "$25K Evaluation",
      },
    ],
    ongoing: [
      {
        competition_name: "June Competition",
        start_date: "Sat 1st Jun 2024 | 04:00 PM",
        end_date: "Fri 14th Jun 2024 | 09:00 AM",
        status: "ongoing",
        participants: 75,
        first_prize: "$150K Evaluation",
        second_prize: "$75K Evaluation",
        third_prize: "$35K Evaluation",
      },
      {
        competition_name: "June Competition",
        start_date: "Sat 1st Jun 2024 | 04:00 PM",
        end_date: "Fri 14th Jun 2024 | 09:00 AM",
        status: "ongoing",
        participants: 75,
        first_prize: "$150K Evaluation",
        second_prize: "$75K Evaluation",
        third_prize: "$35K Evaluation",
      },
      {
        competition_name: "June Competition",
        start_date: "Sat 1st Jun 2024 | 04:00 PM",
        end_date: "Fri 14th Jun 2024 | 09:00 AM",
        status: "ongoing",
        participants: 75,
        first_prize: "$150K Evaluation",
        second_prize: "$75K Evaluation",
        third_prize: "$35K Evaluation",
      },
    ],
    upcoming: [
      {
        competition_name: "July Competition",
        start_date: "Mon 1st Jul 2024 | 04:00 PM",
        end_date: "Sun 14th Jul 2024 | 09:00 AM",
        status: "upcoming",
        participants: 0,
        first_prize: "$200K Evaluation",
        second_prize: "$100K Evaluation",
        third_prize: "$50K Evaluation",
      },
      {
        competition_name: "July Competition",
        start_date: "Mon 1st Jul 2024 | 04:00 PM",
        end_date: "Sun 14th Jul 2024 | 09:00 AM",
        status: "upcoming",
        participants: 0,
        first_prize: "$200K Evaluation",
        second_prize: "$100K Evaluation",
        third_prize: "$50K Evaluation",
      },
      {
        competition_name: "July Competition",
        start_date: "Mon 1st Jul 2024 | 04:00 PM",
        end_date: "Sun 14th Jul 2024 | 09:00 AM",
        status: "upcoming",
        participants: 0,
        first_prize: "$200K Evaluation",
        second_prize: "$100K Evaluation",
        third_prize: "$50K Evaluation",
      },
    ],
  };

  const filteredData = dummyData[activeTab] || [];

  return (
    <div className="competition_container">
      <div className="mobile_headers">
        <h4>Competition</h4>
      </div>
      <div className="header_wrapper">
        <h3>Competition List</h3>
        <Button
          onClick={() => navigate("/competitions/competition-list-logs")}
          className="view_logs__btn standard_button"
        >
          View Logs
        </Button>
      </div>
      <div className="table_header_filter">
        <div className="filter_buttons">
          <Button
            className={activeTab === "upcoming" ? "active" : ""}
            onClick={() => handleTabChange("upcoming")}
          >
            Upcoming
          </Button>
          <Button
            className={activeTab === "ongoing" ? "active" : ""}
            onClick={() => handleTabChange("ongoing")}
          >
            Ongoing
          </Button>
          <Button
            className={activeTab === "ended" ? "active" : ""}
            onClick={() => handleTabChange("ended")}
          >
            Ended
          </Button>
        </div>
        <Button
          onClick={() => navigate("create-competition")}
          className="view_logs__btn standard_button"
        >
          Create Competition
        </Button>{" "}
      </div>
      <div className="competition_data">
        {filteredData.map((item, index) => (
          <CompetitionCard key={item.id} item={item} index={index} />
        ))}
      </div>
      <Pagination
        total={10}
        showSizeChanger
        showQuickJumper
        showTotal={(total) => `Total ${total} items`}
      />
    </div>
  );
};

export default Competition;

const CompetitionCard = ({ item, index }) => {
  return (
    <div className="competition_card_container">
      <div className="header_section">
        <h4>{item.competition_name}</h4>
        <img className="threeDotMenu" src={threeDotsIcon} alt="threeDotMenu" />
      </div>
      <div className="competition_info">
        <div className="topSection">
          <p className="label">Validity</p>
          <p className="value">{item.start_date}</p>
          <p className="label">to</p>
          <p className="value">{item.end_date}</p>
        </div>
        <div className="bottomSection">
          <div className="status_box">
            <p className="label">Status</p>
            <p
              className={`status_value ${
                item.status === "ongoing"
                  ? "ongoing"
                  : item.status === "upcoming"
                  ? "upcoming"
                  : "ended"
              }`}
            >
              {item.status}
            </p>
          </div>
          <div className="participants_info">
            <p className="label">Participants</p>
            <p className="value">{item.participants}</p>
          </div>
        </div>
      </div>
      <div className="prize_container">
        <div className="header">
          <h4>Prizes</h4>
        </div>
        <div className="prizes_wrapper">
          <div className="prize_box first_prize">
            <p className="label">1st</p>
            <p className="value">{item.first_prize}</p>
          </div>
          <div className="prize_box second_prize">
            <p className="label">2nd</p>
            <p className="value">{item.second_prize}</p>
          </div>
          <div className="prize_box third_prize">
            <p className="label">3rd</p>
            <p className="value">{item.third_prize}</p>
          </div>
        </div>
      </div>
      <Button className="view_board">View Leaderboard</Button>
    </div>
  );
};
