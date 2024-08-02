import {combineReducers} from "redux";

import accountReducer from "./accountSlice";
import advReducer from "./advSlice";
import authReducer from "./authSlice";
import compReducer from "../NewReducers/competitionSlice";
import couponReducer from "./couponSlice";
import errorAlertReducer from "./error";
import msgAlertReducer from "./message";
import plansReducer from "./plansSlice";
import plansTableReducer from "./plansTableSlice";
import supportReducer from "./supportSlice";
import userReducer from "./userSlice";

import fundingReducer from "../NewReducers/fundingSlice";
import affiliateReducer from "../NewReducers/affiliateSlice";
import listReducer from "../NewReducers/listSlice";
import riskReducer from "../NewReducers/riskSlice";
import generalReducer from "../NewReducers/generalSlice";
import usReducer from "../NewReducers/usSlice";
import amReducer from "../NewReducers/amSlice";
import accountList from "../NewReducers/accountList";
import payoutSlice from "../NewReducers/payout";
import accountMetrics from "../NewReducers/accountMetrics";
import paymentSlice from "../NewReducers/payment";
import couponSlice from "../NewReducers/Coupons";
import SupportSlice from "../NewReducers/Support";
import complianceList from "../NewReducers/complianceList";
import countryWiseSlice from "../NewReducers/countryWise";
import getUserProfileData from "../NewReducers/userProfileSlice";
import logsReducer from "../NewReducers/logsSlice";
import revenueMangement from "../NewReducers/revenueMangement";

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  funding: fundingReducer,
  // support: supportReducer,
  // coupon: couponReducer,
  adv: advReducer,
  comp: compReducer,
  plans: plansReducer,
  plansTable: plansTableReducer,
  account: accountReducer,
  error: errorAlertReducer,
  message: msgAlertReducer,

  affiliate: affiliateReducer,
  list: listReducer,
  risk: riskReducer,
  general: generalReducer,
  usSlice: usReducer,
  accountList: accountList,
  accountMetrics: amReducer,
  payoutList: payoutSlice,
  payment: paymentSlice,
  coupon: couponSlice,
  support: SupportSlice,
  compliance: complianceList,
  countryWise: countryWiseSlice,
  userProfile: getUserProfileData,
  logs: logsReducer,
  revenue: revenueMangement,
});

export default rootReducer;
