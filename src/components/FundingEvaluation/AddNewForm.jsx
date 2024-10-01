import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Input, Button, Switch } from "antd";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { createChallenge } from "../../utils/api/apis";
import { returnMessages } from "../../store/reducers/message";
import { returnErrors } from "../../store/reducers/error";

const AddValueForm = () => {
  const location = useLocation();
  const initialAccountBalance = location.state?.accountBalance || "";
  const idToken = useSelector((state) => state.auth.idToken);

  const [formData, setFormData] = useState({
    fundingEvaluation: "Scaling",
    name: "",
    accountBalance: initialAccountBalance,
    leverage: "",
    minTradingDays: "",
    phase1TotalDays: "",
    phase2TotalDays: "",
    evaluationPhase1: "",
    evaluationPhase2: "",
    maxLoss: "",
    maxDailyLoss: "",
    profitSplit: "",
    maxCapitalGrowth: "",
    tradingRequirement: "",
    price: "",
    server: "ACGMarkets-Live",
    broker: "ACG Markets",
    biWeeklyProfitSplit: false,
    tradeThroughNews: false,
    holdOverWeekend: false,
    ea: false,
    hedgingAndStocking: false,
    martingale: false,
  });

  const [errors, setErrors] = useState({});

  const handleSwitchChange = (field) => (checked) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked,
    }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationSchema = Yup.object().shape({
      fundingEvaluation: Yup.string().required("Funding Evaluation is required"),
      name: Yup.string().required("Name is required"),
      accountBalance: Yup.string().required("Account Balance is required"),
      leverage: Yup.string().required("Leverage is required"),
      minTradingDays: Yup.string().required("Minimum Trading Days is required"),
      phase1TotalDays: Yup.string().required("Phase 1 Total Days is required"),
      phase2TotalDays: Yup.string().required("Phase 2 Total Days is required"),
      evaluationPhase1: Yup.string().required("Evaluation Phase 1 is required"),
      evaluationPhase2: Yup.string().required("Evaluation Phase 2 is required"),
      maxLoss: Yup.string().required("Max Loss is required"),
      maxDailyLoss: Yup.string().required("Max Daily Loss is required"),
      profitSplit: Yup.string().required("Profit Split is required"),
      maxCapitalGrowth: Yup.string().required("Max Capital Growth is required"),
      tradingRequirement: Yup.string().required("Trading Requirement is required"),
      price: Yup.string().required("Price is required"),
      biWeeklyProfitSplit: Yup.boolean().required("Bi-weekly Profit Split is required"),
      tradeThroughNews: Yup.boolean().required("Trade Through News is required"),
      holdOverWeekend: Yup.boolean().required("Hold Over Weekend is required"),
      ea: Yup.boolean().required("EAs is required"),
      hedgingAndStocking: Yup.boolean().required("Hedging and Stocking is required"),
      martingale: Yup.boolean().required("Martingale is required"),
    });

    try {
      await validationSchema.validate(formData, { abortEarly: false });

      let challengeData = {
        name: formData.name,
        account_balance: formData.accountBalance,
        Leverage: formData.leverage,
        plan_type: formData.fundingEvaluation,
        minimum_trading_days: formData.minTradingDays,
        phase_1_total_days: formData.phase1TotalDays,
        phase_2_total_days: formData.phase2TotalDays,
        Evaluation_Phase_1: formData.evaluationPhase1,
        Evaluation_Phase_2: formData.evaluationPhase2,
        Max_Loss: formData.maxLoss,
        Max_Daily_Loss: formData.maxDailyLoss,
        Profit_Split: formData.profitSplit,
        Bi_Weekly_Profit_Split: formData.biWeeklyProfitSplit,
        Max_Capital_Growth: formData.maxCapitalGrowth,
        Trading_Requirements: formData.tradingRequirement,
        Tradable_Asset: 'FX/Indices/Commodities',
        Trade_through_News: formData.tradeThroughNews,
        Hold_over_the_Weekend: formData.holdOverWeekend,
        EAs: formData.ea,
        Hedging_and_Stacking: formData.hedgingAndStocking,
        Martin_Gale: formData.martingale,
        Price: formData.price,
        server: formData.server,
        broker: formData.broker,
      }
      await createChallenge(idToken, challengeData);
      dispatch(returnMessages("Challenge created", 200))
    

      console.log("Challenge created successfully" , challengeData);
    } catch (err) {
      const errorMessages = {};
      err.inner.forEach((error) => {
        errorMessages[error.path] = error.message;
      });
      setErrors(errorMessages);
      console.error("Validation failed:", errorMessages);
      dispatch(returnErrors("Error creating challenge" , 400))
    }
  };

  return (
    <div className="create_plan_container">
      <form onSubmit={handleSubmit} className="create_plan_form">
        <div className="row1">
          <div className="form_input">
            <label>Funding Evaluation</label>
            <Input
              name="fundingEvaluation"
              value={formData.fundingEvaluation}
              disabled
            />
          </div>

          <div className="form_input">
            <label>Name</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
            />
            {errors.name && <div style={{ color: "red" }}>{errors.name}</div>}
          </div>

          <div className="form_input">
            <label>Account Balance</label>
            <Input
              name="accountBalance"
              value={formData.accountBalance}
              disabled
            />
            {errors.accountBalance && <div style={{ color: "red" }}>{errors.accountBalance}</div>}
          </div>
        </div>
        <div className="row1">
          <div className="form_input">
            <label>Leverage</label>
            <Input
              name="leverage"
              value={formData.leverage}
              onChange={handleChange}
            />
          </div>

          <div className="form_input">
            <label>Minimum Trading Days</label>
            <Input
              name="minTradingDays"
              value={formData.minTradingDays}
              onChange={handleChange}
              placeholder="Minimum Trading Days"
            />
          </div>

          <div className="form_input">
            <label>Phase 1 Total Days</label>
            <Input
              name="phase1TotalDays"
              value={formData.phase1TotalDays}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row1">
          <div className="form_input">
            <label>Phase 2 Total Days</label>
            <Input
              name="phase2TotalDays"
              value={formData.phase2TotalDays}
              onChange={handleChange}
            />
          </div>

          <div className="form_input">
            <label>Evaluation Phase 1</label>
            <Input
              name="evaluationPhase1"
              value={formData.evaluationPhase1}
              onChange={handleChange}
            />
          </div>

          <div className="form_input">
            <label>Evaluation Phase 2</label>
            <Input
              name="evaluationPhase2"
              value={formData.evaluationPhase2}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row1">
          <div className="form_input">
            <label>Max Loss</label>
            <Input
              name="maxLoss"
              value={formData.maxLoss}
              onChange={handleChange}
            />
          </div>

          <div className="form_input">
            <label>Max Daily Loss</label>
            <Input
              name="maxDailyLoss"
              value={formData.maxDailyLoss}
              onChange={handleChange}
            />
          </div>

          <div className="form_input">
            <label>Profit Split</label>
            <Input
              name="profitSplit"
              value={formData.profitSplit}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row1">
          <div className="form_input">
            <label>Max Capital Growth</label>
            <Input
              name="maxCapitalGrowth"
              value={formData.maxCapitalGrowth}
              onChange={handleChange}
            />
          </div>

          <div className="form_input">
            <label>Trading Requirement</label>
            <Input
              name="tradingRequirement"
              value={formData.tradingRequirement}
              onChange={handleChange}
            />
          </div>

          <div className="form_input">
            <label>Price</label>
            <Input
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row1">
          <div className="form_input">
            <label>Server</label>
            <Input
              name="server"
              value={formData.server}
              disabled
            />
          </div>

          <div className="form_input">
            <label>Broker</label>
            <Input
              name="broker"
              value={formData.broker}
              disabled
            />
          </div>
        </div>
        <div className="row1">
          <div>
            <label>Bi-weekly Profit Split</label>
            <Switch
              checked={formData.biWeeklyProfitSplit}
              onChange={handleSwitchChange("biWeeklyProfitSplit")}
            />
          </div>

          <div>
            <label>Trade Through News</label>
            <Switch
              checked={formData.tradeThroughNews}
              onChange={handleSwitchChange("tradeThroughNews")}
            />
          </div>

          <div>
            <label>Hold Over Weekend</label>
            <Switch
              checked={formData.holdOverWeekend}
              onChange={handleSwitchChange("holdOverWeekend")}
            />
          </div>
        </div>
        <div className="row1">
          <div>
            <label>EAs</label>
            <Switch
              checked={formData.ea}
              onChange={handleSwitchChange("ea")}
            />
          </div>

          <div>
            <label>Hedging and Stocking</label>
            <Switch
              checked={formData.hedgingAndStocking}
              onChange={handleSwitchChange("hedgingAndStocking")}
            />
          </div>

          <div>
            <label>Martingale</label>
            <Switch
              checked={formData.martingale}
              onChange={handleSwitchChange("martingale")}
            />
          </div>
        </div>
        <Button type="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </form>
    </div>
  );
};

export default AddValueForm;
