import { combineReducers } from "redux";

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
import listReducer from '../NewReducers/listSlice'
import accountList from "../NewReducers/accountList";
import payoutSlice from "../NewReducers/payout"
import accountMetrics from "../NewReducers/accountMetrics";
import paymentSlice from "../NewReducers/payment";
import couponSlice from "../NewReducers/Coupons";
import SupportSlice from "../NewReducers/Support";

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
  accountList: accountList,
  accountMetrics : accountMetrics,
  payoutList:payoutSlice,
  payment:paymentSlice,
  coupon:couponSlice,
  support:SupportSlice
});

export default rootReducer;
