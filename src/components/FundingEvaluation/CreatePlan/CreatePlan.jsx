import {useDispatch, useSelector} from "react-redux";
import {CreateTradingAccountReq, UserSearchReq} from "../../../utils/api/apis";
import "./CreatePlan.scss";
import {useEffect, useState} from "react";
import {returnErrors} from "../../../store/reducers/error";
import {returnMessages} from "../../../store/reducers/message";
import {CircularProgress} from "@mui/material";
import {Button, Input, Select, Spin} from "antd";
import {fetchFundingDetails} from "../../../store/NewReducers/fundingSlice";
import LoaderOverlay from "../../../ReusableComponents/LoaderOverlay";
const {Option} = Select;

const CreateTradingAccount = () => {
  const [emailOpts, setEmailOpts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const idToken = useSelector((state) => state.auth.idToken);
  const dispatch = useDispatch();

  const {fundingData} = useSelector((state) => state.funding);
  const [index, setIndex] = useState(0);

  // User search by email
  const fetch = async (value) => {
    setIsLoading(true);
    const response = await UserSearchReq(idToken, value);
    setIsLoading(false);
    if (response?.status < 399) {
      const userArray = response?.data?.results?.map((item) => ({
        label: item?.email,
        value: item?.id,
      }));
      setEmailOpts(userArray);
    } else {
      const msg = response?.response?.data?.detail || "Something went wrong";
      dispatch(returnErrors(msg, 400));
    }
  };

  const [isSpinner, setIsSpinner] = useState(false);

  const stages = ["Evaluation", "Verification", "Funded"];
  const platforms = ["MT5", "C-Trader", "Dx-Trader"];
  const rawSpreadOptions = [
    {label: "Raw Spread", value: "Raw Spread"},
    {label: "No Commission", value: "No commission"},
  ];

  const [data, setData] = useState({
    challenge: null,
    group: "ACGd\\demo ACG",
    leverage: "",
    name: "",
    pwd: "",
    pwdInvestor: "",
    raw_spread: "",
    status: "",
    user: "",
    platform: "",
    email: "",
    reason: "",
    // plan_type: "",
    // account_size: "",
  });

  const [fundingEvaluationOptions, setFundingEvaluationOptions] = useState([]);
  const [amounts, setAmounts] = useState([]);

  useEffect(() => {
    fetch("");
  }, []);

  useEffect(() => {
    if (fundingData) {
      const fundingEvu = Object.keys(fundingData).map((item, index) => ({label: `${item}`, value: `${item}`}));
      const Amounts = Object.values(fundingData).map((value, index) => value?.map((amount, index) => amount?.account_balance));
      setFundingEvaluationOptions(fundingEvu);
      setAmounts(Amounts);
    }
  }, [fundingData]);

  useEffect(() => {
    console.log("dataFundingAcc : ", data);
  }, [data]);

  const handleCreateTradingAccount = async () => {
    setIsSpinner(true);
    const {challenge, group, leverage, name, pwd, pwdInvestor, raw_spread, status, user, email, reason} = data;

    let traderData = {};
    if (data?.platform === "MT5") {
      traderData = {
        challenge: challenge,
        group: group,
        leverage: leverage,
        name: name,
        pwd: pwd,
        pwdInvestor: pwdInvestor,
        reason: reason,
        status: status,
        user: user,
        email: email,
      };
    }
    if (data?.platform === "C-Trader") {
      traderData = {
        user: user,
        name: name,
        pwd: pwd,
        pwdInvestor: pwdInvestor,
        group: group,
        leverage: leverage,
        challenge: challenge,
        status: status,
        email: email,
        reason: reason,
      };
    }
    if (data?.platform === "Dx-Trader") {
      traderData = {
        user: user,
        name: name,
        pwd: pwd,
        pwdInvestor: pwdInvestor,
        group: group,
        leverage: leverage,
        challenge: challenge,
        status: status,
        email: email,
        reason: reason,
      };
    }

    console.log("traderdata : ", traderData);
    const response = await CreateTradingAccountReq(idToken, traderData, data?.platform);
    if (response?.status < 399) {
      dispatch(returnMessages("Created Account Successfully", 201));
    } else {
      const msg = response?.response?.data?.detail || "Something went wrong";
      dispatch(returnErrors(msg, 400));
    }
    setData({
      challenge: null,
      group: "ACGd\\demo ACG",
      leverage: "",
      name: "",
      pwd: "",
      pwdInvestor: "",
      raw_spread: "",
      status: "",
      user: "",
      platform: "",
      email: "",
      reason: "",
    });

    traderData = {};
    setIsSpinner(false);
  };

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
      {isSpinner && <LoaderOverlay />}
      <div className="create_plan_form">
        <div className="row1">
          <div className="form_input">
            <label htmlFor="Platform">Platform</label>
            <Select
              placeholder="Select a platform"
              style={{width: "100%"}}
              options={platforms.map((platform) => ({label: platform, value: platform}))}
              onChange={(value) => setData((prev) => ({...prev, platform: value}))}
              value={data?.platform === "" ? null : data?.platform}
            />
          </div>
          <div className="form_input">
            <label htmlFor="AccountName">Account name</label>
            <Input
              placeholder="Enter your Account Name"
              onChange={(e) => setData((prev) => ({...prev, name: e.target.value}))}
              value={data?.name}
            />
          </div>
          <div className="form_input">
            <label htmlFor="Password">Password</label>
            <Input
              placeholder="Enter your password"
              onChange={(e) => setData((prev) => ({...prev, pwd: e.target.value, pwdInvestor: e.target.value}))}
              value={data?.pwd}
            />
          </div>
        </div>
        <div className="row1">
          <div className="form_input">
            <label htmlFor="Email">Email</label>
            <Select
              showSearch
              placeholder="Search for a user"
              style={{width: "100%"}}
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              onSearch={handleOnInputChange}
              onChange={(value, x) =>
                setData((prev) => ({
                  ...prev,
                  user: value,
                  email: x.label,
                }))
              }
              notFoundContent={isLoading ? <Spin size="small" /> : null}
              options={emailOpts}
              value={data?.email === "" ? null : data?.email}
            />
          </div>
          <div className="form_input">
            <label htmlFor="RawSpread">Raw Spread</label>
            <Select
              className="rawSpread_selector"
              placeholder="Select a Raw Spread"
              options={rawSpreadOptions}
              onChange={(value) => setData((prev) => ({...prev, raw_spread: value === "Raw Spread" ? true : false}))}
              value={data?.raw_spread === "" ? null : data?.raw_spread ? "Raw Spread" : "No Commission"}
            />
          </div>
          <div className="form_input">
            <label htmlFor="FundingEvaluation">Funding Evaluation</label>
            <Select
              className="funding_evaluation_selector"
              placeholder="Select a Funding Evaluation"
              options={fundingEvaluationOptions ? fundingEvaluationOptions : []}
              onChange={(value) => {
                let x = null;
                for (let i = 0; i < fundingEvaluationOptions.length; i++) {
                  if (value === fundingEvaluationOptions[i]?.value) {
                    x = i;
                    break;
                  }
                }
                setIndex(x || 0);
                const updates = {
                  challenge: x + 1,
                };
                // setData((prev) => {
                //   return {...prev, ...updates};
                // });
                setData((prev) => {
                  return {...prev, fundingEvalValue: value};
                });
              }}
              value={data?.fundingEvalValue ? data?.fundingEvalValue : null}
            />
          </div>
        </div>
        <div className="row1">
          <div className="form_input">
            <label htmlFor="AccountBalance">Account Balance</label>
            <Select
              className="funding_evaluation_selector"
              placeholder="Enter account balance"
              options={index !== -1 ? amounts[index]?.map((item) => ({label: item, value: item})) : []}
              onChange={(value, x) => {
                const update = {
                  // account_size: value,
                  leverage: 100,
                  // parseInt(fundingData[fundingEvaluationOptions[index]?.value].map((item) => (item?.account_balance === value ? item?.Leverage : -1)).filter((item) => item !== -1)[0]) || null,
                };
                const selectedChallenge = fundingData?.[data?.fundingEvalValue]?.filter((item) => item.account_balance === value)?.map((item) => item.id);
                setData((prev) => ({...prev, ...update}));
                setData((prev) => ({...prev, challenge: selectedChallenge ? selectedChallenge[0] : null}));
                setData((prev) => ({...prev, leverageDisplayValue: value}));
              }}
              value={data?.leverageDisplayValue ? data?.leverageDisplayValue : null}
            />
          </div>
          <div className="form_input">
            <label htmlFor="Stage">Stage</label>
            <Select
              className="stage_selector"
              placeholder="Select Stage"
              options={stages.map((stage) => ({label: stage, value: stage}))}
              onChange={(value) => setData((prev) => ({...prev, status: value}))}
              value={data?.status === "" ? null : data?.status}
            />
          </div>
          <div className="form_input">
            <label htmlFor="Server">Broker</label>
            <Input
              placeholder="Enter Broker"
              value={"ACG Markets"}
            />
          </div>
          <div className="form_input">
            <label htmlFor="Server">Server</label>
            <Input
              placeholder="Enter server"
              value={"ACGMarkets-Live"}
            />
          </div>
          <div className="form_input">
            <label htmlFor="Reason">Reason</label>
            <Input
              placeholder="Enter Reason"
              onChange={(e) => setData((prev) => ({...prev, reason: e.target.value}))}
              value={data?.reason}
            />
          </div>
        </div>
        <div className="create_button_wrapper">
          <Button
            className="standard_button"
            onClick={handleCreateTradingAccount}
          >
            {isSpinner ? <CircularProgress size={24} /> : "Create Account"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateTradingAccount;
