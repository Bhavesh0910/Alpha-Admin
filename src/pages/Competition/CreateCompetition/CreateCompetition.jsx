import React, { useEffect, useState } from "react";
import "./CreateCompetition.scss";
import { Breadcrumb, Button, DatePicker, Input, message, Select } from "antd";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import TextArea from "antd/es/input/TextArea";
import { useSelector, useDispatch } from "react-redux";
import { createCompetition } from "../../../store/NewReducers/competitionSlice";
import { returnMessages } from "../../../store/reducers/message";
import { returnErrors } from "../../../store/reducers/error";
import dayjs from "dayjs";
import { getChallenges } from "../../../utils/api/apis";

const { Option } = Select;

const CreateCompetition = () => {
  const dispatch = useDispatch();
  const idToken = useSelector((state) => state.auth.idToken);
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    fetchChallenges();
  }, [idToken]);

  const fetchChallenges = async () => {
    try {
      const res = await getChallenges(idToken);
      setChallenges(res?.data);
    } catch (error) {
      console.log("Error fetching challenges:", error);
    }
  };

  const [formValues, setFormValues] = useState({
    competition_name: "",
    challenge: "", // Change to store challenge id
    schedule_competition: null,
    start_date: null,
    end_date: null,
    first_prize: "",
    second_prize: "",
    third_prize: "",
    total_contestants: "",
    rules: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormValues({ ...formValues, [id]: value });
  };

  const handleDateChange = (date, dateString, id) => {
    setFormValues({ ...formValues, [id]: dateString });
  };

  const handleChallengeSelect = (value) => {
    setFormValues({ ...formValues, challenge: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const requiredFields = [
      "competition_name",
      "schedule_competition",
      "start_date",
      "end_date",
      "first_prize",
      "second_prize",
      "third_prize",
      // "total_contestants",
    ];

    for (let field of requiredFields) {
      if (!formValues[field]) {
        message.error(`Please fill in the ${field.replace("_", " ")} field`);
        return;
      }
    }

    const formData = {
      competition_name: formValues.competition_name,
      challenge: formValues.challenge,
      Schedule_competition: moment(formValues.schedule_competition).format("YYYY-MM-DD"),
      Start_date: moment(formValues.start_date).format("YYYY-MM-DD"),
      End_Date: moment(formValues.end_date).format("YYYY-MM-DD"),
      First_prize: formValues.first_prize,
      second_prize: formValues.second_prize,
      Third_prize: formValues.third_prize,
      // total_contestants: formValues.total_contestants,
      Competition_rules: formValues.rules,
    };

  

    try {
      dispatch(createCompetition({ idToken, formData }));
      navigate("/competitions");
    } catch (error) {
      dispatch(returnErrors("Error creating competition"));
    }
  };

  const disabledDate = (current) => {
    return current && current < dayjs().endOf("day");
  };

  return (
    <div className="createCompetition_container">
      <Breadcrumb
        separator=">"
        items={[
          {
            title: <Link className="page_header" to="/competitions">Competition List</Link>,
          },
          {
            title: <Link className="breadcrumb" to="">Create Competition</Link>,
          },
        ]}
      />
      <div className="createCompetition_wrapper">
        <form className="createCompetitionForm" onSubmit={handleSubmit}>
          <div className="topSection">
            <div className="form_input_box">
              <label htmlFor="competition_name">Competition Name</label>
              <Input
                id="competition_name"
                placeholder="Enter Competition Name"
                value={formValues.competition_name}
                onChange={handleInputChange}
              />
            </div>
            <div className="form_input_box">
              <label htmlFor="challenge_id">Challenge</label>
              <Select
                id="challenge_id"
                placeholder="Select Challenge"
                onChange={handleChallengeSelect}
              >
                {Object.keys(challenges).map((category) => (
                  
                  <React.Fragment key={category}>
                      {challenges[category].map((challenge) => (
                        <Option key={challenge.id} value={challenge.id}>
                          {challenge.name}
                        </Option>
                      ))}
                  </React.Fragment>
                ))}
              </Select>
            </div>
            <div className="form_input_box">
              <label htmlFor="total_contestants">Total Contestants</label>
              <Input
                id="total_contestants"
                placeholder="Enter Total Contestants"
                value={formValues.total_contestants}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="bottomSection">
            <div className="form_input_box">
              <label htmlFor="schedule_competition">Schedule Competition</label>
              <DatePicker
                style={{ color: "#fff" }}
                format="YYYY-MM-DD"
                disabledDate={disabledDate}
                onChange={(date, dateString) => handleDateChange(date, dateString, "schedule_competition")}
              />
            </div>
            <div className="form_input_box">
              <label htmlFor="start_date">Start Date</label>
              <DatePicker
                format="YYYY-MM-DD"
                disabledDate={disabledDate}
                onChange={(date, dateString) => handleDateChange(date, dateString, "start_date")}
              />
            </div>
            <div className="form_input_box">
              <label htmlFor="end_date">End Date</label>
              <DatePicker
                format="YYYY-MM-DD"
                disabledDate={disabledDate}
                onChange={(date, dateString) => handleDateChange(date, dateString, "end_date")}
              />
            </div>
            <div className="form_input_box">
              <label htmlFor="first_prize">1st Prize</label>
              <Input
                id="first_prize"
                placeholder="Enter 1st Prize"
                value={formValues.first_prize}
                onChange={handleInputChange}
              />
            </div>
            <div className="form_input_box">
              <label htmlFor="second_prize">2nd Prize</label>
              <Input
                id="second_prize"
                placeholder="Enter 2nd Prize"
                value={formValues.second_prize}
                onChange={handleInputChange}
              />
            </div>
            <div className="form_input_box">
              <label htmlFor="third_prize">3rd Prize</label>
              <Input
                id="third_prize"
                placeholder="Enter 3rd Prize"
                value={formValues.third_prize}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="footer_section">
            <div className="form_input_box">
              <label htmlFor="competition_rules">Competitions Rules</label>
              <TextArea
                id="rules"
                showCount
                maxLength={100}
                onChange={handleInputChange}
                placeholder="Type competition rules"
                style={{
                  height: 93,
                  resize: "none",
                }}
                value={formValues.rules}
              />
            </div>
            <Button className="standard_button" htmlType="submit">
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCompetition;
