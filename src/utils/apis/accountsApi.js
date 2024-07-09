import axios from "axios";
import { baseUrl } from "../api/apis";
import moment from "moment";
import { returnMessages } from "../../store/reducers/message";

const accountListReq = async (idToken, dates, pageNo, pageSize, searchText, status, phase) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };

    // console.log("Status : ", status);
    // console.log("phase : ", phase);
    let response;
    if (phase) {
      response = await axios.get(`${baseUrl}account/admin/accounts-list/?start_date=${dates ? dates[0] : ""}&end_date=${dates ? dates[1] : ""}&page=${pageNo ? pageNo : 1}&page_size=${pageSize ? pageSize : ""}&search=${searchText ? searchText : ""}&is_active=${status === "active" ? true : status === "inactive" ? false : ""}&phase=${phase}`, config);
    } else {
      response = await axios.get(`${baseUrl}account/admin/accounts-list/?start_date=${dates ? dates[0] : ""}&end_date=${dates ? dates[1] : ""}&page=${pageNo ? pageNo : 1}&page_size=${pageSize ? pageSize : ""}&search=${searchText ? searchText : ""}&is_active=${status === "active" ? true : status === "inactive" ? false : ""}`, config);

    }


    return response.data;
  } catch (error) {
    console.error("Error during accountList request:", error);
    throw error;
  }
};

const getPaymentHistoryList = async (idToken) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };
    const response = await axios.get("payment/payment-history/", config);
    return response.data;
  } catch (error) {
    console.error("Error during accountList request:", error);
    throw error; // Re-throw the error so it can be handled by the caller
  }
};

const fundingEvalutionPlans = async () => {
  try {
    const response = await axios.get(`account/funding-evaluation/`);
    return response.data;
  } catch (error) {
    console.error("Error during account metrics request:", error);
    throw error; // Re-throw the error so it can be handled by the caller
  }
};
const getBalanceChartRequest = async (idToken, loginId) => {
  try {
    let config = {
      headers: { Authorization: `Bearer ${idToken}` },
    };
    const response = await axios.get(
      `${baseUrl}account/admin/balance-equity/${loginId}`,
      config
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
const getPerformanceChartRequest = async (idToken, loginId) => {
  try {
    let config = {
      headers: { Authorization: `Bearer ${idToken}` },
    };
    const response = await axios.get(
      `${baseUrl}account/performance-chart/${loginId}`,
      config
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
export {
  accountListReq,
  getPaymentHistoryList,
  fundingEvalutionPlans,
  getBalanceChartRequest,
  getPerformanceChartRequest,
};
