import axios from "axios";
import {baseUrl} from "../api/apis";
import moment from "moment";
import {returnMessages} from "../../store/reducers/message";

const accountListReq = async (idToken, query, platform) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };

    let response = await axios.get(`${baseUrl}v2/${platform}/list/${query}`, config);

    return response.data;
  } catch (error) {
    console.error("Error during accountList request:", error);
    throw error;
  }
};

const changeAccountStatusApi = async (idToken, body) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };
    console.log(body, "body");

    let response = await axios.post(`${baseUrl}v2/deactivate/user/`, body, config);
    return response.data;
  } catch (error) {
    console.error("Error during accountList request:", error);
    throw error;
  }
};

const deleteAcountApi = async (idToken, body, platform) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };

    let response;
    console.log("Bodyyyy : ", idToken, body, platform);
    if (platform === "trader-accounts") {
      response = await axios.delete(`${baseUrl}v2/trader-accounts/delete/${body?.login_id}/`, config);
    }
    if (platform === "ctrader-accounts") {
      response = await axios.delete(`${baseUrl}v2/ctrader-accounts/delete/${body?.login_id}/`, config);
    }
    if (platform === "dxtraders") {
      response = await axios.delete(`${baseUrl}vv2/dxtraders/list/delete/${body?.login_id}`, config);
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
      headers: {Authorization: `Bearer ${idToken}`},
    };
    const response = await axios.get(`${baseUrl}account/admin/balance-equity/${loginId}`, config);

    return response.data;
  } catch (error) {
    throw error;
  }
};
const getPerformanceChartRequest = async (idToken, loginId) => {
  try {
    let config = {
      headers: {Authorization: `Bearer ${idToken}`},
    };
    const response = await axios.get(`${baseUrl}account/performance-chart/${loginId}`, config);

    return response.data;
  } catch (error) {
    throw error;
  }
};
export {accountListReq, changeAccountStatusApi, deleteAcountApi, getPaymentHistoryList, fundingEvalutionPlans, getBalanceChartRequest, getPerformanceChartRequest};
