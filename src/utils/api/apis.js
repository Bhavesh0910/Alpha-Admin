import axios from "axios";
import {retry} from "redux-saga/effects";
import {returnErrors} from "../../store/reducers/error";
import {setIsLoading} from "../../store/NewReducers/authSlice";

//  Acg Futures Admin
// export const baseUrl = "http://13.42.34.37/";
export const baseUrl = "https://backend.alphacapitalgroup.uk/";

export const alphaNewLogin = async (payload, dispatch) => {
  const {email, password} = payload;

  try {
    const response = await axios.post(`${baseUrl}adm/email/signin/`, {
      email,
      password,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

const signupRequest = async (formdata) => {
  const response = await axios.post(`${baseUrl}auth/register/`, formdata);
  return response;
};

//User

const getUserDetailsReq = async (idToken) => {
  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };
  const output = await axios
    .get(`${baseUrl}user/profile/`, config)
    .then((res) => {
      return res.data;
    })
    .catch(function (error) {
      return error;
    });
  return output;
};

export const requestPasswordResetApi = async (idToken, email) => {
  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };

  const output = await axios
    .post(`${baseUrl}password/reset-request/`, {email}, config)
    .then((res) => res.data)
    .catch((error) => error.response.data);

  return output;
};

// UserAddress
const getUserAddress = async (idToken) => {
  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };
  const output = await axios
    .get(`${baseUrl}user/billing/address/`, config)
    .then((res) => {
      return res.data;
    })
    .catch(function (error) {
      return error;
    });
  return output;
};

// Post
const addUserAddress = async (idToken, data) => {
  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };
  const output = await axios
    .post(`${baseUrl}user/billing/address/`, data, config)
    .then((res) => {
      return res.data;
    })
    .catch(function (error) {
      return error;
    });
  return output;
};

// Patch
const updateUserAddress = async (idToken, data) => {
  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };
  const output = await axios
    .patch(`${baseUrl}user/billing/address/`, data, config)
    .then((res) => {
      return res.data;
    })
    .catch(function (error) {
      return error;
    });
  return output;
};

const updateUserDetailsRequest = async ({updatedData, idToken, id}) => {
  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };
  let output;

  console.log(updatedData);
  await axios
    .patch(`${baseUrl}v2/admin/user-profile/${id}`, updatedData, config)
    .then((res) => {
      output = res.data;
      return output;
    })
    .catch(function (error) {
      output = error;
      return output;
    });
  return output;
};

const loadUser = async (idToken) => {
  let config = {
    headers: {
      Authorization: "Bearer " + idToken,
    },
  };
  let output;
  await axios
    .get(`${baseUrl}auth/user/`, config)
    .then((res) => {
      output = res;
      return output;
    })
    .catch(function (error) {
      output = error;
      return output;
    });
};

//funding

const getFundingDetails = async (idToken) => {
  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };
  let output;
  await axios
    .get(`${baseUrl}v2/challenges/admin/`, config)
    .then((res) => {
      output = res;
      return output;
    })
    .catch(function (error) {
      output = error;
      return output;
    });

  return output;
};

// const getNewFundingDetails = async (idToken) => {
//   let config = {
//     headers: {
//       Authorization: `Bearer ${idToken}`,
//     },
//   };
//   let output;
//   await axios
//     .get(`${baseUrl}v2/challenges/admin/`, config)
//     .then((res) => {
//       output = res;
//       return output;
//     })
//     .catch(function (error) {
//       output = error;
//       return output;
//     });

//   return output;
// };

//support
const getSupportTableDetails = async (idToken, pageNumber, type, severity, status, search) => {
  const params = {
    page: pageNumber,
    page_size: 50,
  };
  if (type) {
    params.type = typeof type === "string" ? type : type.value;
  }
  if (severity) {
    params.severity = severity.value;
  }
  if (status) {
    params.status = status.value;
  }
  if (search) {
    params.user = search;
    params.page = 1;
  }
  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    params: params,
  };
  let output;
  await axios
    .get(`${baseUrl}support/admin/case/`, config)
    .then((res) => {
      output = res.data;

      return output;
    })
    .catch(function (error) {
      output = error;
      return output;
    });

  return output;
};
const getSupportTableDetailsNew = async (idToken, searchText, pageNo, pageSize, activeTab) => {
  // const params = {
  //   page: pageNo,
  //   page_size: 50,
  // };
  // if (type) {
  //   params.account_type = typeof type === "string" ? type : type.value;
  // }
  // if (severity) {
  //   params.severity = severity.value;
  // }
  // if (status) {
  //   params.status = status.value;
  // }
  // if (search) {
  //   params.search = search;
  //   params.page = 1;
  // }
  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    // params: params,
  };
  let output;
  console.log("Active : ", activeTab);
  // searchText=searchText || "";
  // pageNo= pageNo || "", pageSize, activeTab
  await axios
    .get(`${baseUrl}account/admin/contracts/?search=${searchText}&status=${activeTab === "all" ? "" : activeTab}&page=${pageNo}&page_size=${pageSize}`, config)
    .then((res) => {
      output = res.data;
      return output;
    })
    .catch(function (error) {
      throw error;
    });

  return output;
};

const updateSupportDetails = async (idToken, id, formData) => {
  const apiUrl = `${baseUrl}support/admin/case/${id}`;

  const config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };
  let output;
  await axios
    .patch(apiUrl, formData, config)
    .then((res) => {
      if (res?.response?.stauts > 399) {
        output = res;
        return output;
      }
      output = res;
      return output;
    })
    .catch(function (error) {
      output = error;
      return output;
    });
  return output;
};

const deleteSupportDetails = async (idToken, id) => {
  const apiUrl = `${baseUrl}support/admin/case/${id}`;

  const config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios.delete(apiUrl, config);

    return response;
  } catch (error) {
    return error;
  }
};
//Certificates
const getCertificatesDetails = async (idToken, user_id , query) => {


  console.log(user_id)


  const config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios.get(`${baseUrl}achievements/admin/certificates/list/${query}`, config);
    return response;
  } catch (error) {
    return error;
  }
};

// TraderList

const getAllTradersRequest = async (idToken, searchValue, pageNumber, phase, active, competition, tab, dispatch) => {
  try {
    const params = {
      page: pageNumber,
      page_size: 21,
    };
    if (searchValue !== null) {
      params.search = searchValue;
      // params.page = 1;
    }
    if (active === true) {
      params.active = "True";
    }
    if (active === false) {
      params.active = "False";
    }
    if (phase) {
      params.phase = phase.value;
    }
    // if (competition === true) {
    //   params.competition = "True";
    // }
    // if (competition === false) {
    //   params.competition = "False";
    // }
    if (tab !== null) {
      params.type = tab;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
      params: params,
    };

    const response = await axios.get(`${baseUrl}account/admin/accounts-list/`, config);

    if (response?.status < 399) return response.data;
    if (response.response?.status > 399) {
      dispatch(returnErrors("something went wrong", 400));
      return {
        count: 0,
        results: [],
      };
    }
  } catch (error) {
    // dispatch(returnErrors("something went wrong", 400));
    return {
      count: 0,
      results: [],
    };
  }
};
const getSearchTradersRequest = async (idToken, competition, search) => {
  try {
    const params = {
      search: search,
    };
    if (competition === true) {
      params.competition = "True";
    }

    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
      params: params,
    };

    const response = await axios.get(`${baseUrl}account/admin/accounts-list/`, config);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

//affiliate
const traderAffiliateRefList = async (idToken, id, status = "success") => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
      params: {
        status: status,
      },
    };
    const response = await axios.get(`${baseUrl}v3/get/referred-users/list/?affiliate_id=${id}`, config);
    return response.data;
  } catch (error) {
    console.error("Error in getting trader ref list", error);
    throw error;
  }
};

export const getPushleadsChartData = async (idToken, user_id) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };
    const response = await axios.get(`${baseUrl}affiliate/v2/dashboard/?affiliate_id=${user_id}`, config);
    return response.data;
  } catch (error) {
    console.error("Error in getting trader ref list", error);
    throw error;
  }
};

export async function fetchAffiliateExport(idToken, affiliateId) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };
    const response = await axios.get(`${baseUrl}v3/export/affiliate-reffered/?affiliate_id=${affiliateId}`, config);
    return response;
  } catch (error) {
    throw error; // Handle the error as needed
  }
}

const getAffiliateDetails = async (idToken) => {
  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };
  let output;
  await axios
    .get(`${baseUrl}affiliates/list/`, config)
    .then((res) => {
      output = res.data;

      return output;
    })
    .catch(function (error) {
      output = error;
      return output;
    });

  return output;
};

const getAffiliateList = async (idToken) => {
  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };
  let output;
  await axios
    .get(`${baseUrl}affiliates/admin/affiliate-list/`, config)
    .then((res) => {
      output = res;

      return output;
    })
    .catch(function (error) {
      output = error;
      return output;
    });

  return output;
};
const sendCredential = async (idToken, login_id) => {
  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };
  let output;
  await axios
    .post(`${baseUrl}account/admin/email-credentials/`, login_id, config)
    .then((res) => {
      output = res;
      return output;
    })
    .catch(function (error) {
      output = error;
      return output;
    });

  return output;
};
const getAffiliateListV2 = async (idToken, pageNo, pageSize, search) => {
  // console.log("search", search);
  const params = {
    page: pageNo,
    page_size: pageSize,
  };
  if (search) {
    params.search = search;
    params.page = 1;
  }
  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
    params: params,
  };

  const url = `${baseUrl}affiliates/admin/affiliate-list/v2/`;
  try {
    const response = await axios.get(url, config);
    return response;
  } catch (error) {
    return error;
  }
};

export const fetchCommissionPayment = async (idToken, affiliateId, pageNo, pageSize) => {
  const config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };

  console.log(pageNo)
  
  const url = `${baseUrl}affiliate/v2/commission/payment/?affiliate_id=${affiliateId}&page=${pageNo}&page_size=${pageSize}`;

  try {
    const res = await axios.get(url, config);
    return res; 
  } catch (error) {
    throw error; 
  }
};

export const fetchAffiliateCode = async (idToken, affiliateId) => {
  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };
  const url = `${baseUrl}affiliate/v2/code/list/?affiliate_id=${affiliateId}`;

  let output;
  await axios
    .get(url, config)
    .then((res) => {
      output = res;

      return output;
    })
    .catch(function (error) {
      output = error;
      return output;
    });

  return output;
};

export async function getExportHistory(idToken, urls) {
  const url = `${baseUrl}${urls}`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching export history:", error);
    throw error;
  }
}

const postAffiliateDetails = async (idToken, data) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "multipart/form-data",
      },
    };

    const response = await axios.post(`${baseUrl}v3/create/affiliate-code/`, data, config);
    if (response.status === 201 || response.status === 200) {
      return response.data;
    } else {
      console.error("POST request for affiliate data failed:", response.status, response.data);
      throw new Error("POST request failed");
    }
  } catch (error) {
    console.error("Error making POST request for affiliate data:", error);
    throw error;
  }
};

// User List
const getUserList = async (idToken, searchText, pageNo, pageSize, authType, active) => {
  const params = {
    page: pageNo,
    page_size: pageSize,
  };
  if (active) {
    params.is_active = 1;
  } else {
    params.is_active = 0;
  }
  if (active === null) {
    delete params.is_active;
  }
  if (searchText) {
    params.search = searchText;
    params.page = 1;
  }
  console.log(authType);
  if (authType) {
    params.auth_type = authType;
    params.page = 1;
  }

  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
    params: params,
  };

  const url = `${baseUrl}user-list/`;

  let output;
  await axios
    .get(url, config)
    .then((res) => {
      output = res;

      return output;
    })
    .catch(function (error) {
      output = error;
      return output;
    });

  return output;
};

//user login
const postAdminLogin = async (idToken, value) => {
  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };

  // console.log(value);
  // return
  //create a form data
  const formData = new FormData();
  formData.append("email", value.user);
  let output;
  await axios
    .post(`${baseUrl}auth/admin/custom-token/`, formData, config)
    .then((res) => {
      output = res;
      return output;
    })
    .catch(function (error) {
      output = error;
      return output;
    });

  return output;
};

//Payout Apis
const getPayoutListRequest = async (idToken, search, method, payoutType, currentPage) => {
  const params = {
    page: currentPage,
    page_size: 20,
  };

  if (method) {
    params.status = method;
    // params.page = 1 || currentPage;
  }
  if (search) {
    params.search = search;
    params.page = 1;
  }
  if (payoutType) {
    params.payout_type = payoutType;
  }

  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
    params: params,
  };

  const url = `${baseUrl}user/admin/payout/`;

  let output;
  await axios
    .get(url, config)
    .then((res) => {
      output = res;

      return output;
    })
    .catch(function (error) {
      output = error;
      return output;
    });

  return output;
};

const generatePayoutRequest = async (idToken, data) => {
  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };
  try {
    const response = await axios.put(`${baseUrl}user/admin/payout/${data.id}/`, data?.data, config);
    return response;
  } catch (error) {
    return error;
  }
};
const generatePayoutRequestNew = async (idToken, data) => {
  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };
  try {
    const response = await axios.post(`${baseUrl}user/admin/payout/`, data, config);
    return response;
  } catch (error) {
    return error;
  }
};

// Payment List
const getPaymentList = async (idToken, search, status, plan, currentPage) => {
  const params = {
    page: currentPage,
    page_size: 21,
  };

  if (status) {
    params.payment_status = status;
  }
  if (search) {
    params.search = search;
    params.page = 1;
  }
  if (plan) {
    params.plan = plan;
  }

  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
    params: params,
  };

  const url = `${baseUrl}payment/admin/transaction-history/`;

  let output;
  await axios
    .get(url, config)
    .then((res) => {
      output = res;

      return output;
    })
    .catch(function (error) {
      output = error;
      return output;
    });

  return output;
};
// affiliate codes list
const getAffiliateCodelist = async (idToken, pageNo, pageSize, search, currentPage) => {
  const params = {
    page: pageNo,
    page_size: pageSize,
  };

  // if (status) {
  //   params.payment_status = status;
  // }
  if (search) {
    params.search = search;
    params.page = 1;
  }
  // if (plan) {
  //   params.plan = plan;
  // }

  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
    params: params,
  };

  const url = `${baseUrl}v2/list/affiliate-code/`;

  let output;
  await axios
    .get(url, config)
    .then((res) => {
      output = res;

      return output;
    })
    .catch(function (error) {
      output = error;
      return output;
    });

  return output;
};

const getCodelistV2 = async (idToken, pageNo, pageSize, email) => {
  const params = {
    page: pageNo,
    page_size: pageSize,
  };

  if (email) {
    params.affiliate = email;
  }

  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
    params: params,
  };
  let output;
  await axios
    .get(`${baseUrl}affiliates/admin/affiliate-code-list/v2/`, config)
    .then((res) => {
      output = res;

      return output;
    })
    .catch(function (error) {
      output = error;
      return output;
    });

  return output;
};

// Payment ListOLD
const getPaymentListOLD = async (idToken, status) => {
  const params = {};

  if (status) {
    params.payment_status = status;
  }
  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
    params: params,
  };
  let output;
  await axios
    .get(`${baseUrl}payment/admin/list/`, config)
    .then((res) => {
      output = res;

      return output;
    })
    .catch(function (error) {
      output = error;
      return output;
    });

  return output;
};

// for user status
const changeUserStatus = async (idToken, note = "", id) => {
  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };
  const payload = new FormData();
  payload.append("id", id);
  payload.append("note", note);
  let output;
  await axios
    .post(`${baseUrl}v2/deactivate/user/`, payload, config)
    .then((res) => {
      output = res;

      return output;
    })
    .catch(function (error) {
      output = error;
      return output;
    });

  return output;
};

//soft block
export const softBlockUserApi = async (idToken, userId, note) => {
  const config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };

  const payload = new FormData();
  payload.append("id", userId);
  payload.append("note", note);

  try {
    const response = await axios.post(`${baseUrl}soft-block/user/`, payload, config);
    return response;
  } catch (error) {
    throw error;
  }
};

// for reset password
const resetPassword = async (idToken, data) => {
  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };
  let output;
  await axios
    .post(`${baseUrl}auth/admin/reset-password/`, data, config)
    .then((res) => {
      output = res;

      return output;
    })
    .catch(function (error) {
      output = error;
      return output;
    });

  return output;
};
// for delete user
const deleteUser = async (idToken, email) => {
  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };
  let output;
  await axios
    .delete(`${baseUrl}auth/admin/delete-user/?email=${email}`, config)
    .then((res) => {
      output = res;

      return output;
    })
    .catch(function (error) {
      output = error;
      return output;
    });

  return output;
};
// for risk management

export const getAccountOverviewStats = async (idToken, startDate, endDate) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };
    let response;
    if (startDate && endDate) {
      response = await axios.get(`${baseUrl}v3/account-overview/stats/?start_date=${startDate}&end_date=${endDate}`, config);
    } else {
      response = await axios.get(`${baseUrl}v3/account-overview/stats/`, config);
    }
    return response;
  } catch (error) {
    return error;
  }
};

export const getStageChart = async (idToken, stage, startDate, endDate) => {
  try {
    // const response = await axios.get(`${baseUrl}v2/account-overview/stage-${stage}-chart/?start_date=${startDate}&end_date=${endDate}`, {

    let response;
    let config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };

    if (startDate && endDate) {
      // response = await axios.get(`${baseUrl}v2/account-overview/stage-${stage}-chart/?start_date=${startDate}&end_date=${endDate}`, config);
      response = await axios.get(`${baseUrl}v3/account-overview/stage-${stage}-chart/?start_date=${startDate}&end_date=${endDate}`, config);
    } else {
      response = await axios.get(`${baseUrl}v3/account-overview/stage-${stage}-chart/`, config);
    }
    return response;
  } catch (error) {
    return error;
  }
};

export const getPassStageChart = async (idToken, stage, startDate, endDate, filter_type) => {
  try {
    // const response = await axios.get(`${baseUrl}v2/account-overview/stage-${stage}-chart/?start_date=${startDate}&end_date=${endDate}`, {
    const params = {};
    if (filter_type) {
      params.filter_type = filter_type;
    }

    let response;
    let config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
      params: params,
    };

    if (startDate && endDate) {
      response = await axios.get(`${baseUrl}advance/stage${stage}-pass/?start_date=${startDate}&end_date=${endDate}`, config);
    } else {
      response = await axios.get(`${baseUrl}advance/stage${stage}-pass/`, config);
    }
    return response;
  } catch (error) {
    return error;
  }
};

export const getFundingChart = async (idToken, startDate, endDate) => {
  try {
    let response;
    let config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };
    if (startDate && endDate) {
      response = await axios.get(`${baseUrl}v3/account-overview/funding-chart/?start_date=${startDate}&end_date=${endDate}`, config);
    } else {
      response = await axios.get(`${baseUrl}v3/account-overview/funding-chart/`, config);
    }
    return response;
  } catch (error) {
    return error;
  }
};

export const getCompDashboardChart = async (idToken, id) => {
  try {
    let response;
    let config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };

    response = await axios.get(`${baseUrl}v2/competition/leaderboard/user-stats/?user_competition_id=${id}`, config);

    return response;
  } catch (error) {
    return error;
  }
};

const getRiskManagement = async (idToken) => {
  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };
  try {
    const response = await axios.get(`${baseUrl}account/admin/risk-management/`, config);
    return response;
  } catch (error) {
    return error;
  }
};

//general logs

export const getGeneralLog = async (idToken, pageNo, pageSize, search = "") => {
  const queries = [];
  queries.push(`page=${pageNo}`);
  queries.push(`page_size=${pageSize}`);
  if (search) {
    queries.push(`search=${search}`);
  }
  const query = queries.join("&");
  try {
    const response = await axios.get(`${baseUrl}Generallog/?${query}`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

//user support

export const updateUserEmail = async (idToken, payload) => {
  const config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };
  try {
    const response = await axios.post(`${baseUrl}update/user/email/`, payload, config);
    return response;
  } catch (error) {
    console.error("Error updating user email:", error);
    throw error;
  }
};

export const requestPayout = async (idToken, payload) => {
  const config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };
  try {
    const response = await axios.post(`${baseUrl}payments/admin/request_payout/`, payload, config);
    return response;
  } catch (error) {
    console.error("Error requesting payout:", error);
    throw error;
  }
};

//acc metrics

export const getTradingAccountOverview = async (login_id, platform, idToken) => {
  let platformName = platform === "trader-accounts" ? "mt5" : platform === "ctrader-accounts" ? "ctrader" : "dxtrade";
  console.log(platformName);
  try {
    const response = await axios.get(`${baseUrl}v2/account-metrics/${login_id}/?platform=${platformName}`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching trading account overview:", error);
    throw error;
  }
};

export const getAccountDetails = async (login_id, platform, idToken) => {
  let platformName = platform === "trader-accounts" ? "mt5" : platform === "ctrader-accounts" ? "ctrader" : "dxtrade";
  try {
    const response = await axios.get(`${baseUrl}v2/account-details/${login_id}/?platform=${platformName}`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching account details:", error);
    throw error;
  }
};

export const getAccountAnalysis = async (platform, login_id, idToken) => {
  let platformName = platform === "trader-accounts" ? "mt5" : platform === "ctrader-accounts" ? "ctrader" : "dxtrade";
  try {
    const url = `${baseUrl}v2/account-analysis/?platform=${platformName}&login_id=${login_id}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching account analysis:", error);
    throw error;
  }
};

export const getAccountInsights = async (login_id, platform, idToken) => {
  let platformName = platform === "trader-accounts" ? "mt5" : platform === "ctrader-accounts" ? "ctrader" : "dxtrade";
  try {
    const response = await axios.get(`${baseUrl}v2/account-insights/${login_id}/?platform=${platformName}`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching account insights:", error);
    throw error;
  }
};

export const getTradeJournal = async (login_id, platform = "mt5", idToken) => {
  let platformName = platform === "trader-accounts" ? "mt5" : platform === "ctrader-accounts" ? "ctrader" : "dxtrade";
  try {
    const response = await axios.get(`${baseUrl}v2/account/datewise-histroy/${login_id}/?platform=${platformName}`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching trade journal:", error);
    throw error;
  }
};

export const getTransactionHistory = async (idToken, user_id) => {
  try {
    const response = await axios.get(
      `${baseUrl}user/transactions/${user_id}/
`,
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    throw error;
  }
};

export const getObjectives = async (login_id, platform, idToken) => {
  let platformName = platform === "trader-accounts" ? "mt5" : platform === "ctrader-accounts" ? "ctrader" : "dxtrade";
  try {
    const response = await axios.get(`${baseUrl}v2/account/objectives/${login_id}/?platform=${platformName}`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching objectives:", error);
    throw error;
  }
};

export const getPerformanceChart = async (login_id, platform, idToken) => {
  let platformName = platform === "trader-accounts" ? "mt5" : platform === "ctrader-accounts" ? "ctrader" : "dxtrade";

  try {
    const response = await axios.get(`${baseUrl}v2/account-metrics/performance-chart/${login_id}/?platform=${platformName}`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching performance chart:", error);
    throw error;
  }
};

//advance

export const getWithdrawalsStatus = async (idToken, query, activeTab) => {
  const params = {};
  if (activeTab && activeTab !== "All") {
    params.status = activeTab;
  }

  try {
    const response = await axios.get(`${baseUrl}payout/Withdrawals-Status/${query}`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
      params: params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching withdrawals status:", error);
    throw error;
  }
};

export const getWithdrawalsDetails = async (idToken, query) => {
  try {
    const response = await axios.get(`${baseUrl}payout/Withdrawals-Status/?status=Approved&${query}`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching withdrawals details:", error);
    throw error;
  }
};

export const getPassRate = async (idToken, query) => {
  try {
    const response = await axios.get(`${baseUrl}advance-stats/PassRate/${query}`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching pass rate:", error);
    throw error;
  }
};

export const getPayoutDetails = async (idToken, query) => {
  try {
    const response = await axios.get(`${baseUrl}advance/payout-details/${query}`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching payout:", error);
    throw error;
  }
};

export const getTotatPayments = async (idToken, query) => {
  try {
    const response = await axios.get(`${baseUrl}total/payment-request/`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching total payments:", error);
    throw error;
  }
};

export const getTotalMethod = async (idToken, query) => {
  try {
    const response = await axios.get(`${baseUrl}api/totalmethod/`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching total method:", error);
    throw error;
  }
};

export const getDailyStats = async (idToken, query) => {
  try {
    const response = await axios.get(`${baseUrl}advance-stats/DailyStats/${query}`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching daily stats:", error);
    throw error;
  }
};

//coupon

const getCouponDetails = async ({idToken, inputText}) => {
  const params = {};
  if (inputText) {
    params.coupon = inputText;
  }

  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
    params: params,
  };
  let output;
  await axios
    .get(`${baseUrl}payment/admin/coupon/`, config)
    .then((res) => {
      output = res.data;

      return output;
    })
    .catch(function (error) {
      output = error;
      return output;
    });

  return output;
};

const postCouponDetails = async (idToken, data) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
    };
    const response = await axios.post(`${baseUrl}payment/admin/coupon/`, data, config);

    return response;
  } catch (error) {
    return error;
  }
};

const deleteCouponDetails = async (idToken, couponCode) => {
  const apiUrl = `${baseUrl}payment/admin/coupon/?coupon=${couponCode}`;

  const config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios.delete(apiUrl, config);
  } catch (error) {
    console.error("An error occurred while deleting the coupon:", error);
  }
};

export const getLeaderboardDetails = async (idToken, id) => {
  const apiUrl = `${baseUrl}v2/competition/leaderboard/?competition_id=${id}`;

  const config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };
  try {
    const response = await axios.get(apiUrl, config);
    console.log(response);
    return response;
  } catch (error) {
    console.error("An error occurred ", error);
  }
};
const updateCouponDetails = async (idToken, data) => {
  const config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios.patch(`${baseUrl}payment/admin/coupon/?coupon=${data.id}`, data, config);

    if (response.status === 201 || response.status === 200) {
      return response.data;
    } else {
      console.error("PATCH request for coupon data failed:", response.status, response.data);
      throw new Error("PATCH request failed");
    }
  } catch (error) {
    console.error("Error making PATCH request for coupon data:", error);
    throw error;
  }
};

//adv

const getAdvDetails = async (idToken) => {
  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };
  let output;
  await axios
    .get(`${baseUrl}marketing/admin/marketing/`, config)
    .then((res) => {
      output = res.data;

      return output;
    })
    .catch(function (error) {
      output = error;
      return output;
    });

  return output;
};

const postAdvDetails = async (idToken, data) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };

    const response = await axios.post(`${baseUrl}marketing/admin/marketing/`, data, config);

    if (response.status === 201 || response.status === 200) {
      return response.data;
    } else {
      console.error("POST request for adv data failed:", response.status, response.data);
      throw new Error("POST request failed");
    }
  } catch (error) {
    console.error("Error making POST request for adv data:", error);
    throw error;
  }
};

const deleteAdvDetails = async (idToken, Id) => {
  const apiUrl = `${baseUrl}marketing/admin/marketing/?advertisement_id=${Id}`;

  const config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios.delete(apiUrl, config);

    if (response.status === 204) {
    } else {
      console.error(`Failed to delete adv with code ${Id}.`);
    }
  } catch (error) {
    console.error("An error occurred while deleting the adv:", error);
  }
};

const updateAdvDetails = async (idToken, data, id) => {
  const apiUrl = `${baseUrl}marketing/admin/marketing/?advertisement_id=${id}`;

  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };
  let output;
  await axios
    .patch(apiUrl, data, config)
    .then((res) => {
      output = res.data;
      return output;
    })
    .catch(function (error) {
      output = error;
      return output;
    });
  return output;
};

//permissions

export const getPermissionList = async (idToken) => {
  try {
    const response = await axios.get(`${baseUrl}permission-list/`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching permission list:", error);
    throw error;
  }
};

export const getGroupsList = async (idToken) => {
  try {
    const response = await axios.get(`${baseUrl}groups-list/`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching groups list:", error);
    throw error;
  }
};

export const createGroupPermissionsApi = async (idToken, groupData) => {
  try {
    const response = await axios.post(
      `${baseUrl}admin-create-group-permissions/`,
      {
        group_name: groupData.group_name,
        permission_id: groupData.permission_id,
      },
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error creating group permissions:", error);
    throw error;
  }
};

export const assignGroupPermissions = async (idToken, userId, groupId, permissionIds) => {
  try {
    const response = await axios.post(
      `${baseUrl}admin/assign-group-permissions/`,
      {
        user_id: userId,
        group_id: groupId,
        permission_ids: permissionIds,
      },
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error assigning group permissions:", error);
    throw error;
  }
};

export const getGroupPermissions = async (idToken, id) => {
  try {
    const response = await axios.get(`${baseUrl}group-permissions/${id}/`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching group permissions:", error);
    throw error;
  }
};

export const getAdminUsersGroupsPermissions = async (idToken, search) => {
  try {
    const response = await axios.get(`${baseUrl}admin-users-groups-permissions/?search=${search}`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching admin user groups permissions:", error);
    throw error;
  }
};

//competition

const getCompDetails = async (idToken) => {
  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };
  let output;
  await axios
    .get(`${baseUrl}v3/adm/competition/list/`, config)
    .then((res) => {
      output = res;

      return output;
    })
    .catch(function (error) {
      output = error;
      return output;
    });

  return output;
};

export const getOneCompDetails = async (idToken, id) => {
  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };
  let output;
  await axios
    .get(`${baseUrl}account/admin/competitions/${id}`, config)
    .then((res) => {
      output = res;

      return output;
    })
    .catch(function (error) {
      output = error;
      return output;
    });

  return output;
};

export const getCompTableDetails = async (idToken, id) => {
  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };
  let output;
  await axios
    .get(`${baseUrl}v2/competition/leaderboard/?competition_id=${id}`, config)
    .then((res) => {
      output = res;

      return output;
    })
    .catch(function (error) {
      output = error;
      return output;
    });

  return output;
};

export const getChallenges = async (idToken) => {
  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };
  let output;
  await axios
    .get(`${baseUrl}v2/challenges/admin/`, config)
    .then((res) => {
      output = res;

      return output;
    })
    .catch(function (error) {
      output = error;
      return output;
    });

  return output;
};

const postCompDetails = async (idToken, formData) => {
  try {
    const response = await axios.post(`${baseUrl}adm/competition/`, formData, {
      headers: {
        Authorization: `Bearer ${idToken}`,
        // "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error creating competition: ${error.response?.data?.message || error.message}`);
  }
};

const deleteCompDetails = async (idToken, id) => {
  const apiUrl = `${baseUrl}v3/adm/competition/${id}`;

  const config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios.delete(apiUrl, config);

    if (response.status === 201 || response.status === 204) {
      return response;
    }
  } catch (error) {
    return error;
    // throw error;
  }
};

const updateCompDetails = async (idToken, id, data) => {
  console.log(data, id);
  const apiUrl = `${baseUrl}v3/adm/competition/${id}`;

  const config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
  };
  let output;
  await axios
    .put(apiUrl, data, config)
    .then((res) => {
      output = res.data;
      return output;
    })
    .catch(function (error) {
      output = error;
      return output;
    });
  return output;
};

//plans

const getPlansTableDetails = async (idToken) => {
  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };
  let output;
  try {
    await axios.get(`${baseUrl}account/admin/plans/`, config).then((res) => {
      output = res.data;

      return output;
    });
  } catch (error) {
    output = error;
    return output;
  }

  return output;
};

const updatePlanTableDetails = async (idToken, data, id) => {
  const apiUrl = `${baseUrl}account/admin/plans/${id}`;

  const config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
  };
  let output;
  await axios
    .patch(apiUrl, data, config)
    .then((res) => {
      output = res.data;
      return output;
    })
    .catch(function (error) {
      output = error;
      return output;
    });
  return output;
};

const getPlansDetails = async (idToken) => {
  try {
    let config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };
    const response = await axios.get(`${baseUrl}account/admin/challenges/`, config);
    return response.data;
  } catch (error) {
    return error;
  }
};

const getChallengesDetails = async (idToken) => {
  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };
  let output;
  await axios
    .get(`${baseUrl}account/funding-evaluation/`, config)
    .then((res) => {
      output = res;

      return output;
    })
    .catch(function (error) {
      output = error;
      return output;
    });

  return output;
};

const postPlansDetails = async ({idToken, data}) => {
  try {
    let config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };
    const response = await axios.post(`${baseUrl}account/admin/challenges/`, data, config);
    if (response.status === 201 || response.status === 200) {
      return response;
    } else {
      console.error("POST request for plans data failed:", response.status, response.data);
    }
  } catch (error) {
    return error;
    // throw error;
  }
};

const updatePlansDetails = async ({idToken, data, id}) => {
  const apiUrl = `${baseUrl}account/admin/challenges/${id}`;

  const config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
  };
  let output;

  // return
  await axios
    .patch(apiUrl, data, config)
    .then((res) => {
      output = res;
      return output;
    })
    .catch(function (error) {
      output = error;
      return output;
    });
  return output;
};

const deletePlansDetails = async ({idToken, id}) => {
  const apiUrl = `${baseUrl}account/admin/challenges/${id}`;

  const config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
  };
  let output;
  await axios
    .delete(apiUrl, config)
    .then((res) => {
      output = res;
      return output;
    })
    .catch(function (error) {
      output = error;
      return output;
    });
  return output;
};

const deletePlansTableDetails = async (idToken, id) => {
  const apiUrl = `${baseUrl}account/admin/plans/${id}`;

  const config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios.delete(apiUrl, config);

    if (response.status === 201 || response.status === 204) {
      return true;
    }
  } catch (error) {
    return error;
    // throw error;
  }
};

const postPlansTableDetails = async (idToken, data) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
    };
    const response = await axios.post(`${baseUrl}account/admin/plans/`, data, config);
    if (response.status === 201 || response.status === 200) {
      return response;
    } else {
      console.error("POST request for plans data failed:", response.status, response.data);
    }
  } catch (error) {
    return error;
    // throw error;
  }
};
// import user to admin apis
const getFundingEvaluationPlansRequest = async (idToken) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };
    const response = await axios.get(`${baseUrl}account/funding-evaluation/`, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};
const getPaymentHistoryRequest = async (data) => {
  let config = {
    headers: {
      Authorization: `Bearer ${data.idToken}`,
    },
    // params:{email:email}
  };
  const output = await axios
    .get(`${baseUrl}payment/admin/payment-history/?email=${data.email}`, config)
    .then((res) => {
      return res;
    })
    .catch(function (error) {
      throw error;
    });
  return output;
};
const getCompetitionListRequest = async (idToken) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };
    const response = await axios.get(`${baseUrl}account/competition-list/`, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const enterCompetitionRequest = async (idToken, body) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };
    const response = await axios.post(`${baseUrl}account/participate-competition/`, body, config);
    return response;
  } catch (error) {
    return error;
  }
};
// Leaderboard
const getLeaderboardDetailsReq = async (idToken, id) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };
    const response = await axios.get(`${baseUrl}user/competition/${id}/`, config);
    return response;
  } catch (error) {
    return error;
  }
};

const getUserAccountListRequest = async (idToken, searchValue, pageNumber, phase, active, competition, tab, dispatch) => {
  try {
    const params = {
      page: pageNumber,
      page_size: 21,
    };
    if (searchValue !== null) {
      params.search = searchValue;
      // params.page = 1;
    }
    if (active === true) {
      params.active = "True";
    }
    if (active === false) {
      params.active = "False";
    }
    if (phase) {
      params.phase = phase.value;
    }
    // if (competition === true) {
    //   params.competition = "True";
    // }
    // if (competition === false) {
    //   params.competition = "False";
    // }
    if (tab !== null) {
      params.type = tab;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
      params: params,
    };

    const response = await axios.get(`${baseUrl}account/admin/accounts-list/`, config);

    if (response?.status < 399) return response.data;
    if (response.response?.status > 399) {
      dispatch(returnErrors("something went wrong", 400));
      return {
        count: 0,
        results: [],
      };
    }
  } catch (error) {
    // dispatch(returnErrors("something went wrong", 400));
    return {
      count: 0,
      results: [],
    };
  }
};

const getAccountMetricsRequest = async ({idToken, loginId, dispatch}) => {
  try {
    let config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };

    const response = await axios.get(`${baseUrl}account/admin/metrics/${loginId}`, config);
    if (response.status >= 400) {
      throw new Error(response);
    }

    return response;
  } catch (error) {
    throw error;
  }
};
const getBalanceChartRequest = async ({idToken, loginId}) => {
  try {
    let config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };
    const response = await axios.get(`${baseUrl}account/balance-equity/${loginId}`, config);

    return response.data;
  } catch (error) {
    throw error;
  }
};

// const getPayoutListRequest = async (idToken) => {
//   let config = {
//     headers: { Authorization: `Bearer ${idToken}` },
//   };
//   const output = await axios
//     .get(`${baseUrl}user/payout/list/`, config)
//     .then((res) => {
//       return res.data;
//     })
//     .catch(function (error) {
//       throw error;
//     });
//   return output;
// };
const getTraderJournalRequest = async (idToken) => {
  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };
  const output = await axios
    .get(`${baseUrl}account/trade-journal/`, config)
    .then((res) => {
      return res.data;
    })
    .catch(function (error) {
      throw error;
    });
  return output;
};

//awards
const createAwardRequest = async (idToken, data, dispatch) => {
  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };
  const response = await axios.post(`${baseUrl}account/admin/award/`, data, config);

  if (response.status < 399) {
    return response;
  } else {
    dispatch(returnErrors("faild to create award", 400));
  }
};
const updateAwardRequest = async (idToken, data, dispatch) => {
  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };
  const response = await axios.patch(`${baseUrl}account/admin/award/`, data, config);

  if (response.status < 399) {
    return response;
  } else {
    dispatch(returnErrors("faild to create award", 400));
  }
};
// Upgrade account

const upgradeUserAccountReq = async (idToken, data) => {
  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };
  const response = await axios.post(`${baseUrl}account/admin/create-account/`, data, config);
  return response;
};
const upgradeFundedUserAccountReq = async (idToken, data) => {
  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };
  const response = await axios.post(`${baseUrl}account/admin/funded-account-create/`, data, config);
  return response;
};
const generateContractRequest = async (idToken, id, data) => {
  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };
  const response = await axios.post(`${baseUrl}account/admin/generate-contract/${id}`, data, config);
  return response;
};
const updateUserAccountReq = async (idToken, data) => {
  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };
  const response = await axios.patch(`${baseUrl}account/admin/update-account/`, data, config);
  return response;
};

const getOverviewReq = async (idToken, phase) => {
  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };
  const response = await axios.get(`${baseUrl}account/admin/account-overview/?phase=${phase}`, config);
  return response;
};

// Create trading account apis
const UserSearchReq = async (idToken, search) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
    };
    const response = await axios.get(`${baseUrl}v2/users/list/?search=${search}`, config);
    if (response.status === 201 || response.status === 200) {
      return response;
    } else {
      return response;
    }
  } catch (error) {
    return error;
  }
};
const GetCertificatesADMIN = async (idToken) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
    };
    const response = await axios.get(`${baseUrl}certificate/list/`, config);
    if (response.status === 201 || response.status === 200) {
      return response;
    } else {
      return response;
    }
  } catch (error) {
    return error;
  }
};
const CreateCertificate = async (idToken, data) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
    };

    const response = await axios.post(`${baseUrl}certificate/admin/create/`, data, config);
    if (response.status === 201 || response.status === 200) {
      return response;
    } else {
      return response;
    }
  } catch (error) {
    return error;
  }
};

const EligibleCertificateAccount = async (idToken, email) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
    };
    const response = await axios.get(`${baseUrl}certificate/admin/elible-certificates-acccounts/?email=${email}`, config);
    if (response.status === 201 || response.status === 200) {
      return response;
    } else {
      return response;
    }
  } catch (error) {
    return error;
  }
};

const CreateTradingAccountReq = async (idToken, data, platform) => {
  let config = {
    headers: {
      AUTHORIZATION: `${idToken}`,
    },
  };

  config.headers[
    `x-api-key`
  ] = `ONRzS8gkWBRkr76XYyI6z1e6p6NX72x83KABC4dpx90sSxgzF9n3QqlQoBHGvGZKgu3a2hVPVtMeUYxlyILZMK5cZo2VspEKWORYvdN4fk1WVmtALKKlfwAFFXRpBFyIGQOcNHRtn0dsr6YJhhdNXrDh4Fk5dlt4Cns2CPl5e7QgByxNaSpfJE6vewJVsgmp6KMMWnnOqyMmBWw33NQyTbdP0gCwaLHPlspCEWJDokCUFSVf0IwG8hWJkulr5Al`;

  let endpoint;
  console.log(platform);
  if (platform === "MT5") {
    endpoint = "v2/account-create/admin/";
  } else if (platform === "C-Trader") {
    endpoint = "v2/ctrader-account-create/admin/";
  } else if (platform === "Dx-Trader") {
    endpoint = "v2/dxtrade-account-create/admin/";
  } else {
    throw new Error("Unsupported user type");
  }
  try {
    const response = await axios.post(`${baseUrl}${endpoint}`, data, config);
    return response;
  } catch (error) {
    return error;
  }
};

export const createChallenge = async (idToken, challengeData) => {
  try {
    const response = await axios.post(`${baseUrl}v2/challenges/admin/create/`, challengeData, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating challenge:", error);
    throw error;
  }
};

// IP logs
const ipLogsReq = async (idToken, search, currentPage) => {
  const params = {
    page: currentPage,
    page_size: 20,
  };

  if (search) {
    params.search = search;
    params.page = 1;
  }
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
      params: params,
    };
    const response = await axios.get(`${baseUrl}v2/ip-logs/`, config);
    return response;
  } catch (error) {
    return error;
  }
};

export {
  updateUserDetailsRequest,
  loadUser,
  signupRequest,
  getUserAddress,
  getAffiliateCodelist,
  addUserAddress,
  updateUserAddress,
  getUserDetailsReq,
  getFundingDetails,
  getSupportTableDetails,
  getCertificatesDetails,
  updateSupportDetails,
  deleteSupportDetails,
  getAllTradersRequest,
  getSearchTradersRequest,
  getAffiliateDetails,
  postAffiliateDetails,
  getCouponDetails,
  postCouponDetails,
  updateCouponDetails,
  deleteCouponDetails,
  deleteUser,
  getAdvDetails,
  postAdvDetails,
  deleteAdvDetails,
  resetPassword,
  changeUserStatus,
  updateAdvDetails,
  getCompDetails,
  postCompDetails,
  deleteCompDetails,
  updateCompDetails,
  getPlansDetails,
  postPlansDetails,
  deletePlansDetails,
  updatePlansDetails,
  getPlansTableDetails,
  updatePlanTableDetails,
  deletePlansTableDetails,
  getRiskManagement,
  postPlansTableDetails,
  getFundingEvaluationPlansRequest,
  getPaymentHistoryRequest,
  getCompetitionListRequest,
  getLeaderboardDetailsReq,
  getUserAccountListRequest,
  getAccountMetricsRequest,
  getBalanceChartRequest,
  getPayoutListRequest,
  getTraderJournalRequest,
  traderAffiliateRefList,
  getChallengesDetails,
  createAwardRequest,
  getPaymentList,
  generateContractRequest,
  getAffiliateList,
  upgradeUserAccountReq,
  upgradeFundedUserAccountReq,
  getOverviewReq,
  updateAwardRequest,
  updateUserAccountReq,
  getPaymentListOLD,
  getUserList,
  getAffiliateListV2,
  generatePayoutRequest,
  UserSearchReq,
  CreateTradingAccountReq,
  ipLogsReq,
  EligibleCertificateAccount,
  GetCertificatesADMIN,
  CreateCertificate,
  sendCredential,
  getSupportTableDetailsNew,
  generatePayoutRequestNew,
  postAdminLogin,
  getCodelistV2,
};
