import { useDispatch, useSelector } from "react-redux";
import {
  CreateTradingAccountReq,
  UserSearchReq,
} from "../../../utils/api/apis";
import "./CreatePlan.scss";
import { useEffect, useState } from "react";
import { returnErrors } from "../../../store/reducers/error";
import { returnMessages } from "../../../store/reducers/message";
import { CircularProgress } from "@mui/material";
import { Button, Select, Spin } from "antd";
const { Option } = Select
const CreateTradingAccount = () => {
  const [emailOpts, setEmailOpts] = useState([{ label: "", value: "" }]);
  const [isLoading, setIsLoading] = useState(false);
  const idToken = useSelector((state) => state.auth.idToken);
  const dispatch = useDispatch();

  // User search by email
  const fetch = async (value) => {
    setIsLoading(true);
    const response = await UserSearchReq(idToken, value);
    setIsLoading(false);
    if (response?.status < 399) {
      let userArray = [];
      response.data.map((item) =>
        userArray.push({
          label: item?.email,
          value: item?.id,
        })
      );

      setEmailOpts(userArray);
    } else {
      if (response.response.data.message) {
        return;
      }
      let msg = response?.response?.data?.detail || "Something went wrong";
      dispatch(returnErrors(msg, 400));
    }
  };

  // create trading account req
  const fundingData = useSelector((state) => state.funding.fundingData);
  const [planOptions, setPlanOptions] = useState([]);
  const [competitonOptions, setCompetitionOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [phase, setPhase] = useState(null);
  const [isSpinner, setIsSpinner] = useState(false);
  const phaseOptions = [
    { label: "Qualified", value: "qualified" },
    { label: "Assessment", value: "assessment" },


  ];
  const brokerOptions = [{ label: "Aplhaticks", value: "alphaticks" }];
  const [data, setData] = useState({ broker: "alphaticks" });
  const [broker, setBroker] = useState(brokerOptions[0])

  // use Effects

  const handleSelectChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    setSelectedCompetition(null);
  };
  const handleSelectCompetitionChange = (selectedOption) => {
    setSelectedCompetition(selectedOption);
  };
  useEffect(() => {
    let planArray = [];
    fundingData.map((item) => {
      planArray.push({ value: item.id, label: item.name });
    });
    setPlanOptions(planArray);
  }, [fundingData]);

  // console.log(planOptions)

  useEffect(() => {
    let competitionArray = [];
    // console.log(selectedOption)
    fundingData?.map((item) => {
      if (selectedOption === item.id) {
        item.challenges.map((item) => {
          competitionArray.push({ value: item.id, label: item.name });
        });
      }
      // console.log(competitionArray)
      setCompetitionOptions(competitionArray);
    });
  }, [selectedOption]);
  const handleCreateTradingAccount = async () => {
    // console.log(data)
    setIsSpinner(true);
    const response = await CreateTradingAccountReq(idToken, data);
    if (response?.status < 399) {
      dispatch(returnMessages("Created Account Successfully", 201));
    } else {
      let msg = response?.response?.data?.detail || "Something went wrong";
      dispatch(returnErrors(msg, 400));
    }
    setIsSpinner(false);
  };

  const customStyles = {
    option: (provided) => ({
      ...provided,
      color: 'black',  // Change text color to black
    }),
    control: (provided) => ({
      ...provided,
      background: "none",
      width: "100%",
      marginTop: "0px",
      height: 60,
      borderRadius: 8,
      border: "1px solid #eaf0f8;",
      boxShadow: "none",
      fontFamily: "DM Sans, sans-serif",
      fontSize: "14px",
      fontWeight: 700,
      minHeight: "48px",
      height: "48px",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "grey",
      fontSize: "14px",
      fontWeight: 500,
    }),
    valueContainer: (provided, state) => ({
      ...provided,
      height: "48px",
      padding: "0 6px",
      fontWeight: 500,
      marginLeft: "10px",
      color: "#000",
    }),
    input: (provided, state) => ({
      ...provided,
      margin: "0px",
      color: "#000",
    }),
    indicatorSeparator: (state) => ({
      display: "none",
    }),
    indicatorsContainer: (provided, state) => ({
      ...provided,
      height: "48px",
    }),
  };
  let timeoutId = "";
  const handleOnInputChange = (value) => {
    if (typeof value === "string" && value.length > 0) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        fetch(value);
      }, 1500);
    }
  };

  return (
    <>
      <div className="create_plan_container">
        <div className="create_plan_form">
          <div className="row1">
            <div className="form_input">
              <label htmlFor="Email">Platform</label>
              <Select
                showSearch
                placeholder="Search for a user"
                style={{ width: "100%" }}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onSearch={handleOnInputChange}
                onChange={(value) =>
                  setData((prev) => ({ ...prev, user: value }))
                }
                notFoundContent={isLoading ? <Spin size="small" /> : null}
              >
                {emailOpts.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="form_input">
              <label htmlFor="Broker">Account name</label>
              <Select
                className="plan_selector"
                options={brokerOptions}
                styles={customStyles}
                value={broker}
                onChange={(selectedOption) => {
                  setBroker(selectedOption);
                  setData((prev) => ({
                    ...prev,
                    broker: selectedOption,
                  }));
                  handleSelectCompetitionChange(selectedOption);
                }}
              >
                {brokerOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>

          </div>
        </div>
          <div className="row1">
            <div className="form_input">
              <label htmlFor="Email">Email</label>
              <Select
                showSearch
                placeholder="Search for a user"
                style={{ width: "100%" }}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onSearch={handleOnInputChange}
                onChange={(value) =>
                  setData((prev) => ({ ...prev, user: value }))
                }
                notFoundContent={isLoading ? <Spin size="small" /> : null}
              >
                {emailOpts.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="form_input">
              <label htmlFor="Broker">Broker</label>
              <Select
                className="plan_selector"
                options={brokerOptions}
                styles={customStyles}
                value={broker}
                onChange={(selectedOption) => {
                  setBroker(selectedOption);
                  setData((prev) => ({
                    ...prev,
                    broker: selectedOption,
                  }));
                  handleSelectCompetitionChange(selectedOption);
                }}
              >
                {brokerOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>

          </div>
        </div>
        <div className="row2">
          <div className="form_input">
            <label htmlFor="PlanType">Plan Type</label>
            <Select
              style={{ width: "100%" }}
              options={planOptions}
              value={selectedOption}
              onChange={handleSelectChange}
            >
              {planOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </div>
          <div className="form_input">
            <label htmlFor="AccountSize">Account Size</label>
            <Select
              className="plan_selector"
              value={selectedCompetition}
              onChange={(selectedOption) => {
                setData((prev) => ({
                  ...prev,
                  challenge: selectedOption,
                }));

                handleSelectCompetitionChange(selectedOption);
              }}
            >
              {competitonOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </div>
          <div className="form_input">
            <label htmlFor="Phase">Phase</label>
            <Select
              styles={customStyles}
              placeholder="Phase"
              classNamePrefix="react-select"
              options={phaseOptions}
              value={phase}
              onChange={(selectedOption) => {
                setPhase(selectedOption);
                setData((prev) => ({
                  ...prev,
                  phase: selectedOption,
                }));
              }}
            >
              {phaseOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </div>
        </div>
        <div className="create_button_wrapper">
          <Button
            className="standard_button"
            onClick={handleCreateTradingAccount}
            loading={isSpinner}
          >
            {isSpinner ? (
              <CircularProgress size={24} />
            ) : (
              "Create Account"
            )}
          </Button>
        </div>
      </div>
    </div >
    </>
  );
};

export default CreateTradingAccount;
