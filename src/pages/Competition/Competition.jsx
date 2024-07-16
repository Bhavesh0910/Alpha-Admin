import {Button, Pagination, Modal, Input, DatePicker, message, Dropdown, Menu} from "antd";
import React, {useEffect, useState} from "react";
import threeDotsIcon from "../../assets/icons/menu_3dots_icon.svg";
import "./Competition.scss";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import moment from "moment";
import {fetchCompDetails, fetchCompetitionDetail, updateCompetition} from "../../store/NewReducers/competitionSlice";
import TextArea from "antd/es/input/TextArea";
import LoaderOverlay from "../../ReusableComponents/LoaderOverlay";
import {deleteCompDetails} from "../../utils/api/apis";
import {returnMessages} from "../../store/reducers/message";
import {returnErrors} from "../../store/reducers/error";
import dayjs from "dayjs";

const Competition = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [pageSize, setPageSize] = useState(10);
  const [pageNo, setPageNo] = useState(1);
  const navigate = useNavigate();
  const idToken = useSelector((state) => state.auth.idToken);
  const dispatch = useDispatch();
  const {compData, isLoading, error} = useSelector((state) => state.comp);
  const fundingData = useSelector((state) => state.funding.fundingData);

  useEffect(() => {
    dispatch(fetchCompDetails(idToken));
    console.log(compData);
  }, [dispatch, idToken]);

  const today = moment();

  const ongoingComps = compData?.Ongoing

  const upcomingComps = compData?.Upcoming
  const endedComps = compData?.End
  const handleTabChange = (key) => {
    setPageNo(1);
    setActiveTab(key);
  };

  const filteredData = activeTab === "upcoming" ? upcomingComps : activeTab === "ongoing" ? ongoingComps : endedComps;

  const paginatedData = filteredData?.slice(
    (pageNo - 1) * pageSize,
    pageNo * pageSize
  );
  return (
    <div className="competition_container">
      {isLoading && <LoaderOverlay />}
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
          className="create_btn standard_button"
        >
          Create Competition
        </Button>
      </div>
      <div className="competition_data">
        {paginatedData?.map((item, index) => (
          <CompetitionCard key={index} item={item} />
        ))}
      </div>
      <Pagination
        total={filteredData?.length}
        pageSize={pageSize}
        current={pageNo}
        onChange={(page) => setPageNo(page)}
        onShowSizeChange={(current, size) => {
          setPageSize(size);
          setPageNo(1);
        }}
        showSizeChanger
        showQuickJumper
        showTotal={(total) => `Total ${total} items`}
      />
      {error && (
        <p
          className="error"
          style={{color: "#fff"}}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default Competition;

const CompetitionCard = ({item}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formValues, setFormValues] = useState({});
  const dispatch = useDispatch();
  const idToken = useSelector((state) => state.auth.idToken);

  const today = moment();

  let status;
  if (moment(item.End_Date) < today) {
    status = "ended";
  } else if (moment(item.Start_date) > today) {
    status = "upcoming";
  } else {
    status = "ongoing";
  }
  const handleEdit = () => {
    setFormValues(item);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    dispatch(fetchCompDetails(idToken));
  };

  const handleDelete = async (id) => {
    const confirmDelete = Modal.confirm({
      title: "Delete",
      content: "Are you sure you want to delete this competition?",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      className: "delete_modal",
      onOk: async () => {
        try {
          const response = await deleteCompDetails(idToken, id);
          if (response) {
            dispatch(returnMessages("Competition deleted successfully"));
            dispatch(fetchCompDetails(idToken));
          } else {
            dispatch(returnErrors("Failed to delete competition"));
          }
        } catch (error) {
          dispatch(returnErrors("Failed to delete competition"));
        }
      },
      onCancel: () => {
        confirmDelete.destroy();
      },
    });
  };

  const handleMenuClick = ({key}) => {
    if (key === "edit") {
      handleEdit();
    } else if (key === "delete") {
      handleDelete(item.id);
    }
  };

  const menu = (
    <Menu
      className="competition_card_dropdown"
      onClick={handleMenuClick}
    >
      <Menu.Item key="edit">Edit</Menu.Item>
      <Menu.Item key="delete">Delete</Menu.Item>
    </Menu>
  );

  return (
    <div className="competition_card_container">
      <div className="header_section">
        <h4>{item.name}</h4>
        <Dropdown
          overlay={menu}
          trigger={["click"]}
        >
          <img
            style={{cursor: "pointer"}}
            className="threeDotMenu"
            src={threeDotsIcon}
            alt="threeDotMenu"
          />
        </Dropdown>{" "}
      </div>
      <div className="competition_info">
        <div className="topSection">
          <p className="label">Validity</p>
          <p className="value">{item.Start_date}</p>
          <p className="label">to</p>
          <p className="value">{item.End_Date}</p>
        </div>
        <div className="bottomSection">
          <div className="status_box">
            <p className="label">Status</p>
            <p className={`status_value ${status === "ongoing" ? "ongoing" : status === "upcoming" ? "upcoming" : "ended"}`}>{status}</p>
          </div>
          <div className="participants_info">
            <p className="label">Accounts allowed to participate</p>
            <p className="value">{item.total_contestants}</p>
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
            <p className="value">{item.First_prize}</p>
          </div>
          <div className="prize_box second_prize">
            <p className="label">2nd</p>
            <p className="value">{item.second_prize}</p>
          </div>
          <div className="prize_box third_prize">
            <p className="label">3rd</p>
            <p className="value">{item.Third_prize}</p>
          </div>
        </div>
      </div>
      <Button className="view_board">View Leaderboard</Button>
      <Modal
        className="edit_modal"
        title="Edit Competition"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          borderRadius: "20px",
          color: "#fff",
        }}
      >
        <EditCompetitionForm
          initialValues={formValues}
          onClose={handleModalClose}
        />
      </Modal>
    </div>
  );
};

const EditCompetitionForm = ({initialValues, onClose}) => {
  const [formValues, setFormValues] = useState(initialValues);
  const dispatch = useDispatch();
  const idToken = useSelector((state) => state.auth.idToken);

  useEffect(() => {
    setFormValues(initialValues);
  }, [initialValues]);

  const handleInputChange = (e) => {
    const {id, value} = e.target;
    setFormValues({...formValues, [id]: value});
  };

  const handleDateChange = (date, dateString, field) => {
    setFormValues({...formValues, [field]: dateString});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = {
      competition_name: formValues.competition_name,
      challenge: formValues.challenge,
      Schedule_competition: moment(formValues.Schedule_competition).format("YYYY-MM-DD"),
      Start_date: moment(formValues.Start_date).format("YYYY-MM-DD"),
      End_Date: moment(formValues.End_Date).format("YYYY-MM-DD"),
      First_prize: formValues.First_prize,
      second_prize: formValues.second_prize,
      Third_prize: formValues.Third_prize,
      // total_contestants: formValues.total_contestants,
      Competition_rules: formValues.Competition_rules    };

    console.log(updatedData)

    dispatch(updateCompetition({idToken, id: formValues.id, updatedData}))
      .then(() => {
        onClose();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <form
      className="edit_competition_form"
      onSubmit={handleSubmit}
    >
      <div className="form_group">
        <label htmlFor="competition_name">Competition Name</label>
        <Input
          id="name"
          value={formValues.competition_name}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form_group">
        <label htmlFor="challenge_name">Challenge Name</label>
        <Input
          id="challenge"
          value={formValues.challenge}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form_group">
        <label htmlFor="schedule_competition">Schedule Competition</label>
        <DatePicker
          id="schedule_competition"
          value={
            formValues.Schedule_competition
              ? dayjs(formValues.Schedule_competition)
              : null
          }
          onChange={(date, dateString) =>
            handleDateChange(date, dateString, "schedule_competition")
          }
          required
        />
      </div>
      <div className="form_group_2">
        <div>
          <label htmlFor="start_date">Start Date</label>
          <DatePicker
            id="start_date"
            value={formValues.Start_date ? dayjs(formValues.Start_date) : null}
            onChange={(date, dateString) =>
              handleDateChange(date, dateString, "start_date")
            }
            required
          />
        </div>
        <div>
          <label htmlFor="end_date">End Date</label>
          <DatePicker
            id="end_date"
            value={formValues.End_Date ? dayjs(formValues.End_Date) : null}
            onChange={(date, dateString) =>
              handleDateChange(date, dateString, "end_date")
            }
            required
          />
        </div>
      </div>
      <div className="form_group">
        <label htmlFor="first_prize">First Prize</label>
        <Input
          id="first_prize"
          value={formValues.First_prize}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form_group">
        <label htmlFor="second_prize">Second Prize</label>
        <Input
          id="second_prize"
          value={formValues.second_prize}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form_group">
        <label htmlFor="third_prize">Third Prize</label>
        <Input
          id="third_prize"
          value={formValues.Third_prize}
          onChange={handleInputChange}
          required
        />
      </div>
      {/* <div className="form_group">
        <label htmlFor="total_contestants">Total Contestants</label>
        <Input
          id="total_contestants"
          value={formValues.total_contestants}
          onChange={handleInputChange}
          required
        />
      </div> */}
      <div className="form_group">
        <label htmlFor="competition_rules">Competition Rules</label>
        <TextArea
          id="rules"
          value={formValues.Competition_rules}
          onChange={handleInputChange}
          rows={4}
          required
        />
      </div>
      <div className="form_group">
        <Button
          className="standard_button"
          htmlType="submit"
        >
          Update Competition
        </Button>
      </div>
    </form>
  );
};
