import axios from "axios";

const signinReq = async (data) => {
  try {
    const response = await axios.post("auth/login/", data);
    return response.data;
  } catch (error) {
    console.error("Error during sign-in request:", error);
    throw error; // Re-throw the error so it can be handled by the caller
  }
};
const signUpReq = async (data) => {
  try {
    const response = await axios.post("auth/register/", data);
    return response.data;
  } catch (error) {
    console.error("Error during sign-up request:", error);
    throw error; // Re-throw the error so it can be handled by the caller
  }
};
const refreshTokenReq = async (data) => {
  try {
    const response = await axios.post("auth/refresh/", data);
    return response.data;
  } catch (error) {
    console.error("Error during refreshToken request:", error);
    throw error; // Re-throw the error so it can be handled by the caller
  }
};
const resetPasswordReq = async (data) => {
  try {
    const response = await axios.post("auth/reset-password/", data);
    return response.data;
  } catch (error) {
    console.error("Error during reser password request:", error);
    throw error; // Re-throw the error so it can be handled by the caller
  }
};
const getProfileDetailsRequest = async (idToken) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };
    const response = await axios.get(`auth/settings/my-profile/`, config);
    return response;
  } catch (error) {
    throw error;
  }
};
const getCertificates = async (idToken) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };
    const response = await axios.get(`certificate/list/`, config);
    return response;
  } catch (error) {
    throw error;
  }
};
const updateProfileDetails = async (data) => {
  try {
    const response = await axios.post(`auth/settings/my-profile/`, data);
    return response;
  } catch (error) {
    throw error;
  }
};
const changePassword = async (data) => {
  try {
    const response = await axios.post(`auth/settings/change-password/`, data);
    return response;
  } catch (error) {
    throw error;
  }
};

const getVeriffLink = async (idToken) => {
  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };

  try {
    const response = await axios.get(`user/veriff/get-link/`, config);
    return response;
  } catch (error) {
    console.error("Error fetching Veriff link:", error);
    return error.response || error;
  }
};
const getVeriffStatus = async (idToken) => {
  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };

  try {
    const response = await axios.get(`user/veriff/get-decision/`, config);
    return response;
  } catch (error) {
    console.error("Error fetching Veriff status:", error);
    return error.response || error;
  }
};
const digiSigner = async (id, idToken) => {
  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };

  try {
    const response = await axios.get(`account/sign-contract/${id}`, config);
    return response;
  } catch (error) {
    console.error("Error fetching sign-contract status:", error);
    return error.response || error;
  }
};
const getContractListRequest = async (idToken) => {
  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };

  try {
    const response = await axios.get(`account/contracts/`, config);
    return response;
  } catch (error) {
    console.error("Error fetching sign-contract status:", error);
    return error.response || error;
  }
};
const digiSignerStatus = async (id, idToken) => {
  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };

  try {
    const response = await axios.get(`contract-status/${id}`, config);
    return response;
  } catch (error) {
    console.error("Error fetching sign-contract status:", error);
    return error.response || error;
  }
};
const resetRebillPayments = async (idToken, data) => {
  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };

  try {
    const response = await axios.post(
      `payment/reset-rebill-payment/`,
      data,
      config
    );
    return response;
  } catch (error) {
    console.error("Error fetching payment/reset-rebill-payment status:", error);
    return error.response || error;
  }
};

export {
  signinReq,
  signUpReq,
  resetPasswordReq,
  getProfileDetailsRequest,
  refreshTokenReq,
  updateProfileDetails,
  changePassword,
  getCertificates,
  getVeriffLink,
  getVeriffStatus,
  digiSigner,
  getContractListRequest,
  digiSignerStatus,
  resetRebillPayments,
};
