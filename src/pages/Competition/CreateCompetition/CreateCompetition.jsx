import React from "react";
import "./CreateCompetition.scss";
import { Breadcrumb, Button, DatePicker, Input } from "antd";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import TextArea from "antd/es/input/TextArea";
const CreateCompetition = () => {
  const range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  };

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().endOf("day");
  };

  const disabledDateTime = () => ({
    disabledHours: () => range(0, 24).splice(4, 20),
    disabledMinutes: () => range(30, 60),
    disabledSeconds: () => [55, 56],
  });
  const disabledRangeTime = (_, type) => {
    if (type === "start") {
      return {
        disabledHours: () => range(0, 60).splice(4, 20),
        disabledMinutes: () => range(30, 60),
        disabledSeconds: () => [55, 56],
      };
    }
    return {
      disabledHours: () => range(0, 60).splice(20, 4),
      disabledMinutes: () => range(0, 31),
      disabledSeconds: () => [55, 56],
    };
  };

  const onChange = (e) => {
    console.log("Change:", e.target.value);
  };

  return (
    <div className="createCompetition_container">
      <Breadcrumb
        separator=">"
        items={[
          {
            title: <Link to="/competitions">Competition List</Link>,
          },
          {
            title: <Link to="">Create Competition</Link>,
          },
        ]}
      />
      <div className="createCompetition_wrapper">
        {" "}
        <form className="createCompetitionForm" action="">
          <div className="topSection">
            <div className="form_input_box">
              <label htmlFor="competition_name">Competition Name</label>
              <Input
                id="competition_name"
                placeholder="Enter Competition Name"
              />
            </div>
            <div className="form_input_box">
              <label htmlFor="challenge_name">Challenge</label>
              <Input id="challenge_name" placeholder="Type Challenge" />
            </div>
          </div>
          <div className="bottomSection">
            <div className="form_input_box">
              <label htmlFor="coupon_code">Schedule Competition</label>
              <DatePicker
                format="YYYY-MM-DD HH:mm:ss"
                disabledDate={disabledDate}
                disabledTime={disabledDateTime}
                showTime={{
                  defaultValue: dayjs("00:00:00", "HH:mm:ss"),
                }}
              />
            </div>
            <div className="form_input_box">
              <label htmlFor="coupon_code">Start Date</label>
              <DatePicker
                format="YYYY-MM-DD HH:mm:ss"
                disabledDate={disabledDate}
                disabledTime={disabledDateTime}
                showTime={{
                  defaultValue: dayjs("00:00:00", "HH:mm:ss"),
                }}
              />
            </div>
            <div className="form_input_box">
              <label htmlFor="coupon_code">End Date</label>
              <DatePicker
                format="YYYY-MM-DD HH:mm:ss"
                disabledDate={disabledDate}
                disabledTime={disabledDateTime}
                showTime={{
                  defaultValue: dayjs("00:00:00", "HH:mm:ss"),
                }}
              />
            </div>
            <div className="form_input_box">
              <label htmlFor="first_prize">1st Prize</label>
              <Input id="first_prize" placeholder="Enter 1st Prize" />
            </div>{" "}
            <div className="form_input_box">
              <label htmlFor="second_prize">2nd Prize</label>
              <Input id="second_prize" placeholder="Enter 2nd Prize" />
            </div>{" "}
            <div className="form_input_box">
              <label htmlFor="third_prize">3rd Prize</label>
              <Input id="third_prize" placeholder="Enter 3rd Prize" />
            </div>
          </div>
          <div className="footer_section">
            <div className="form_input_box">
              <label htmlFor="competition_rules">Competitions Rules</label>
              <TextArea
                id="competition_rules"
                showCount
                maxLength={100}
                onChange={onChange}
                placeholder="Type competition rules"
                style={{
                  height: 93,
                  resize: "none",
                }}
              />
            </div>
            <Button className="standard_button">Create</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCompetition;
