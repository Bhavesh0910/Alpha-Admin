import axios from "axios";
import {retry} from "redux-saga/effects";
import {returnErrors} from "../../store/reducers/error";
import {setIsLoading} from "../../store/reducers/authSlice";

//  Acg Futures Admin
// export const baseUrl = "http://35.177.123.105/";
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

const updateUserDetailsRequest = async ({formData, idToken}) => {
  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };
  let output;
  await axios
    .patch(`${baseUrl}user/profile/`, formData, config)
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
const getCertificatesDetails = async (idToken, pageNumber, phase, search) => {
  const params = {
    page: pageNumber,
    page_size: 21,
  };
  if (phase) {
    params.phase = phase.value;
  }
  if (search) {
    params.search = search;
    params.page = 1;
  }

  const config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    params: params,
  };

  try {
    const response = await axios.get(`${baseUrl}certificate/admin/all/`, config);
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
const traderAffiliateRefList = async (idToken, id) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
      // params: {
      //   affiliate_code_id: id,
      // },
    };
    const response = await axios.get(`${baseUrl}affiliates/admin/referred-list/${id}`, config);
    return response.data;
  } catch (error) {
    console.error("Error in getting trader ref list", error);
    throw error;
  }
};
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

const postAffiliateDetails = async (idToken, data) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
    };
    const response = await axios.post(`${baseUrl}affiliates/admin/v2/create-link/`, data, config);
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
    page_size: 21,
  };
  if (active) {
    params.active = "True";
  } else {
    params.active = "False";
  }
  if (active === null) {
    delete params.active;
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
const getAffiliateCodelist = async (idToken, search, currentPage) => {
  const params = {
    page: currentPage,
    page_size: 20,
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

//competition

const getCompDetails = async (idToken) => {
  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };
  let output;
  await axios
    .get(`${baseUrl}v2/get/competition/`, config)
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
  const apiUrl = `${baseUrl}adm/competition/${id}`;

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
  const apiUrl = `${baseUrl}adm/competition/${id}`;

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
    const response = await axios.get(
      `${baseUrl}v2/users/list/?${search}`,
      config
    );
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

const CreateTradingAccountReq = async (idToken, data) => {
  let config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };
  try {
    const response = await axios.post(`${baseUrl}account/admin/create-account/`, data, config);
    return response;
  } catch (error) {
    return error;
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
