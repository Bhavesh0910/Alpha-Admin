import { useDispatch, useSelector } from "react-redux";
import { CreateTradingAccountReq, UserSearchReq } from "../../../utils/api/apis";
import "./CreatePlan.scss";
import { useEffect, useState } from "react";
import { returnErrors } from "../../../store/reducers/error";
import { returnMessages } from "../../../store/reducers/message";
import { CircularProgress } from "@mui/material";
import { Button, Input, Select, Spin } from "antd";
import { fetchFundingDetails } from "../../../store/NewReducers/fundingSlice";
const { Option } = Select;

const CreateTradingAccount = () => {
  const [emailOpts, setEmailOpts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const idToken = useSelector((state) => state.auth.idToken);
  const dispatch = useDispatch();

  const { fundingData } = useSelector(state => state.funding);

  // User search by email
  const fetch = async (value) => {
    setIsLoading(true);
    const response = await UserSearchReq(idToken, value);
    setIsLoading(false);
    // console.log(response)
    if (response?.status < 399) {
      const userArray = response?.data?.results?.map((item) => ({
        label: item?.email,
        value: item?.id,
      }));
      // console.log("userArray", userArray)
      setEmailOpts(userArray);
      console.log(userArray, "userarray")
    } else {
      const msg = response?.response?.data?.detail || "Something went wrong";
      dispatch(returnErrors(msg, 400));
    }
  };

  const [planOptions, setPlanOptions] = useState([]);
  const [competitionOptions, setCompetitionOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [phase, setPhase] = useState(null);
  const [isSpinner, setIsSpinner] = useState(false);

  const stages = ['Evaluation', 'Verification', 'Funded'];
  const platforms = ['MT5', 'C-Trader', 'Dx-Trader'];
  const rawSpreadOptions = [
    { label: 'Raw Spread', value: 'Raw Spread' },
    { label: 'No Commission', value: 'No commission' }
  ];


  // const brokerOptions = [{ label: "Alphaticks", value: "alphaticks" }];
  // const [broker, setBroker] = useState(brokerOptions[0]);

  const [data, setData] = useState({
    user_data: null,
    user: '',
    name: '',
    pwd: '',
    pwdInvestor: '',
    group: 'ACGd\\demo ACG',
    leverage: '',
    challenge: '',
    status: 'Evaluation',
    plan_type: '',
    account_size: '',
    platform: 'MT5',
    raw_spread: 'Raw Spread',
  });


  const [fundingEvaluationOptions, setFundingEvaluationOptions] = useState([]);
  const [amounts, setAmounts] = useState([]);

  useEffect(() => { fetch("") }, [])

  // useEffect to populate plan options based on funding data
  useEffect(() => {
    if (fundingData) {
      const fundingEvu = Object.keys(fundingData).map((item, index) => ({ label: `${item}`, value: `${item}` }));
      const Amounts = Object.values(fundingData).map((value, index) => value?.map((amount, index) => amount?.account_balance));
      setFundingEvaluationOptions(fundingEvu);
      setAmounts(Amounts);
    }
  }, [fundingData]);

  // useEffect to populate competition options based on selected plan
  useEffect(() => {
    // if (fundingData && selectedOption) {
    //   const competitionArray = fundingData
    //     .filter((item) => item.id === selectedOption)
    //     .flatMap((item) => item.challenges.map((challenge) => ({
    //       value: challenge.id,
    //       label: challenge.name
    //     })));
    //   setCompetitionOptions(competitionArray);
    // }
  }, [selectedOption, fundingData]);

  const handleSelectChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    setSelectedCompetition(null);
  };

  const handleSelectCompetitionChange = (selectedOption) => {
    setSelectedCompetition(selectedOption);
  };

  const handleCreateTradingAccount = async () => {
    setIsSpinner(true);
    console.log("Data : ", data)
    // let response;
    const response = await CreateTradingAccountReq(idToken, data);
    if (response?.status < 399) {
      dispatch(returnMessages("Created Account Successfully", 201));
    } else {
      const msg = response?.response?.data?.detail || "Something went wrong";
      dispatch(returnErrors(msg, 400));
    }
    setIsSpinner(false);
  };

  // useEffect(() => {
  //   console.log("data : ", data);
  //   console.log("dataaa", {
  //     user_data: null,
  //     user: '',
  //     name: '',
  //     pwd: '',
  //     pwdInvestor: '',
  //     group: 'ACGd\\demo ACG',
  //     leverage: '',
  //     challenge: '',
  //     status: 'Evaluation',
  //     plan_type: '',
  //     account_size: '',
  //     platform: 'MT5',
  //     raw_spread: 'Raw Spread',
  //   })
  //   console.log("Amount", amounts)
  // }, [data])

  let timeoutId;
  const handleOnInputChange = (value) => {
    if (typeof value === "string" && value?.length > 0) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        fetch(value);
      }, 1500);
    }
  };

  return (
    <div className="create_plan_container">
      <div className="create_plan_form">
        <div className="row1">
          <div className="form_input">
            <label htmlFor="Platform">Platform</label>
            <Select
              placeholder="Select a platform"
              style={{ width: "100%" }}
              options={platforms.map((platform) => ({ label: platform, value: platform }))}
              onChange={(value) => setData((prev) => ({ ...prev, platform: value }))}
            />
          </div>
          <div className="form_input">
            <label htmlFor="AccountName">Account name</label>
            {/* <Select
              className="plan_selector"
              options={brokerOptions}
              value={broker}
              onChange={(selectedOption) => {
                setBroker(selectedOption);
                setData((prev) => ({
                  ...prev,
                  broker: selectedOption,
                }));
              }}
            /> */}
            <Input
              placeholder="Enter your Account Name"
              onChange={(e) => setData((prev) => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div className="form_input">
            <label htmlFor="Password">Password</label>
            <Input
              placeholder="Enter your password"
              onChange={(e) => setData((prev) => ({ ...prev, pwd: e.target.value, pwdInvestor: e.target.value }))}
            />
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
              onChange={(value, x) => setData((prev) => ({
                ...prev, user: value, user_data: x
              }))}
              notFoundContent={isLoading ? <Spin size="small" /> : null}
              options={emailOpts}
            />
          </div>
          <div className="form_input">
            <label htmlFor="RawSpread">Raw Spread</label>
            <Select
              className="rawSpread_selector"
              placeholder="Select a Raw Spread"
              options={rawSpreadOptions}
              onChange={(value) => setData((prev) => ({ ...prev, raw_spread: value }))}
            />
          </div>
          <div className="form_input">
            <label htmlFor="FundingEvaluation">Funding Evaluation</label>
            <Select
              className="funding_evaluation_selector"
              placeholder="Select a Funding Evaluation"
              options={fundingEvaluationOptions ? fundingEvaluationOptions : []}
              onChange={(value) => setData((prev) => {
                console.log(value);
                return { ...prev, plan_type: value }
              })}
            />
          </div>
        </div>
        <div className="row2">
          <div className="form_input">
            <label htmlFor="AccountBalance">Account Balance</label>
            <Select
              className="funding_evaluation_selector"
              placeholder="Enter account balance"
              options={data?.plan_type ? data?.plan_type === "alpha_pro" ? amounts[0].map((item) => ({ label: item, value: item })) : data?.plan_type === "free_trial" ? amounts[1].map((item) => ({ label: item, value: item })) : amounts[2].map((item) => ({ label: item, value: item })) : []}

              onChange={(value) => setData((prev) => ({ ...prev, account_size: value }))}
            />
            {/* <Input
              placeholder="Enter account balance"
              onChange={(e) => setData((prev) => ({ ...prev, accountBalance: e.target.value }))}
            /> */}
          </div>
          <div className="form_input">
            <label htmlFor="Stage">Stage</label>
            <Select
              className="stage_selector"
              placeholder="Select Stage"
              options={stages.map((stage) => ({ label: stage, value: stage }))}
              onChange={(value) => setData((prev) => ({ ...prev, status: value }))}
            />
          </div>
          <div className="form_input">
            <label htmlFor="Server">Broker</label>
            <Input
              placeholder="Enter Broker"
              // onChange={(e) => setData((prev) => ({ ...prev, broker: e.target.value }))}
              value={"ACG Markets"}
            />
          </div>
          <div className="form_input">
            <label htmlFor="Server">Server</label>
            <Input
              placeholder="Enter server"
              // onChange={(e) => setData((prev) => ({ ...prev, server: e.target.value }))}
              value={"ACGMarkets-Live"}
            />
          </div>
        </div>
        <div className="create_button_wrapper">
          <Button
            className="standard_button"
            onClick={handleCreateTradingAccount}
            loading={isSpinner}
          >
            {isSpinner ? <CircularProgress size={24} /> : "Create Account"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateTradingAccount;


// account_size: ""
// challenge: ""
// group: "ACGd\\demo ACG"
// leverage: ""
// name: ""
// plan_type: ""
// platform: "MT5"
// pwd: ""
// pwdInvestor: ""
// raw_spread: "Raw Spread"
// status: "Evaluation"
// user: ""
// user_data: null