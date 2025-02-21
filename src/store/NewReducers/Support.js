import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {Req} from "../../utils/apis/accountsApi";
import {returnErrors} from "../reducers/error";
import {returnMessages} from "../reducers/message";
import {PURGE} from "redux-persist";
import axios from "axios";
import {baseUrl, getUserNotesData} from "../../utils/api/apis";


export const fetchUserNotesData = createAsyncThunk("fetchUserNotesData", async ({idToken, id}, {dispatch, rejectWithValue}) => {
  try {
    const response = await getUserNotesData(idToken, id);
    return response?.data;
  } catch (error) {
    const msg = error.response?.data?.detail || "Error fetching User Notes details";
    const status = error.response?.status || 500;
    dispatch(returnErrors(msg, status));
    return rejectWithValue(msg);
  }
});
async function supportListApi(idToken, query, url) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };
    let response;
    if (url) {
      response = await axios(`${baseUrl}${url}${query}`, config);
    } else {
      response = await axios(`${baseUrl}support/admin/get/cases/${query}`, config);
      // response = await axios(`${baseUrl}support/admin/v3/stage2/`, config);
    }
    return response;
  } catch (error) {
    throw error;
  }
}

async function nestedTableApi(idToken, url, flag) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };
    let response;
    if (flag === true && url) {
      response = await axios.post(`${baseUrl}${url}`, {}, config);
    }
    if (flag === false && url) {
      response = await axios.get(`${baseUrl}${url}`, config);
    }
    return response;
  } catch (error) {
    console.log("error :", error);
    throw error;
  }
}

// Define the async thunk for account list
export const supportListReq = createAsyncThunk("support/fetchPhase1List", async ({idToken, query, url, dispatch}, {rejectWithValue}) => {
  try {
    const response = await supportListApi(idToken, query, url);
    return response;
  } catch (error) {
    dispatch(returnErrors(error?.response?.data?.detail || "Error Fetching Support List!", 400));
    return rejectWithValue(error.response.data);
  }
});

export const nestedTableDataReq = createAsyncThunk("support/nestedDataFetch", async ({idToken, url, flag, dispatch}, {rejectWithValue}) => {
  try {
    const response = await nestedTableApi(idToken, url, flag);
    return response;
  } catch (error) {
    dispatch(returnErrors(error?.response?.data?.detail || "Error Fetching User Details!", 400));
    return rejectWithValue(error.response.data);
  }
});

const supportLists = createSlice({
  name: "supports",
  initialState: {
    isLoading: false,
    isError: false,
    data: [],
    count: 1,
    stageStatusOptions: [],
    userNotes:null,
    nestedTableData: null,
    refetch: false,
    isExpandable: null,
  },
  reducers: {
    setIsExpandable: (state, action) => {
      state.isExpandable = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(supportListReq.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(supportListReq.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data?.results || action.payload.data?.data?.results;
        state.count = action.payload.data.count || action.payload.data?.data?.count;
        state.stageStatusOptions = action.payload.data?.props?.status_type;
      })
      .addCase(supportListReq.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(nestedTableDataReq.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(nestedTableDataReq.fulfilled, (state, action) => {
        state.isLoading = false;
        // console.log("action ", action.payload);
        state.nestedTableData = action.payload?.data?.data || action.payload?.data;
      })
      .addCase(nestedTableDataReq.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(statusUpdateReq.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(statusUpdateReq.fulfilled, (state, action) => {
        state.isLoading = false;
        state.refetch = !state.refetch;
      })
      .addCase(statusUpdateReq.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(editCommentReq.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(editCommentReq.fulfilled, (state, action) => {
        state.isLoading = false;
        state.refetch = !state.refetch;
      })
      .addCase(editCommentReq.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(updateContactReq.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(updateContactReq.fulfilled, (state, action) => {
        state.isLoading = false;
        state.refetch = !state.refetch;
      })
      .addCase(updateContactReq.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(createAccountReq.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(createAccountReq.fulfilled, (state, action) => {
        state.isLoading = false;
        state.refetch = !state.refetch;
      })
      .addCase(createAccountReq.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(fetchUserNotesData.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchUserNotesData.fulfilled, (state, action) => {
        // console.log(action?.payload,"op")
        state.isLoading = false;
        state.userNotes = action?.payload?.results;
      })
      .addCase(fetchUserNotesData.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

// Export the async thunk and any reducers if needed
export default supportLists.reducer;
export const {setIsExpandable} = supportLists.actions;

export const statusUpdateReq = createAsyncThunk("support/updateStatus", async ({idToken, body, id, isPayoutUpdate, updatedStatus, dispatch}, {rejectWithValue}) => {
  try {
    const response = await statusUpdateApi(idToken, body, id, isPayoutUpdate, updatedStatus);
    dispatch(returnMessages(response?.data?.message || "Action Performed Successfully!", 200));
    console.log(response,"ress")
    console.log("")

    return response;
  } catch (error) {
    dispatch(returnErrors(error?.response?.data?.detail || "Error Updating the User status!", 400));
    return rejectWithValue(error.response.data);
  }
});

export const editCommentReq = createAsyncThunk("support/editComment", async ({idToken, body, id, stage, dispatch}, {rejectWithValue}) => {
  try {
    const response = await editCommentApi(idToken, body, id, stage);
    // console.log(stage, " stage");
    dispatch(returnMessages(response?.data?.message || "Action Performed Successfully!", 200));
    return response;
  } catch (error) {
    dispatch(returnErrors(error.response?.data?.detail || "Error editing comment.", 400));
    return rejectWithValue(error.response.data);
  }
});

export const updateContactReq = createAsyncThunk("support/updateContract", async ({idToken, body, id, dispatch}, {rejectWithValue}) => {
  try {
    const response = await updateContactApi(idToken, body, id);
    dispatch(returnMessages(response?.data?.message || "Action Performed Successfully!", 200));
    return response;
  } catch (error) {
    dispatch(returnErrors(error?.response?.data?.detail || "Error Updating Contract!", 400));
    return rejectWithValue(error.response.data);
  }
});

export const createAccountReq = createAsyncThunk("support/createAccount", async ({idToken, body, dispatch}, {rejectWithValue}) => {
  try {
    const response = await createAccountApi(idToken, body);
    dispatch(returnMessages(response?.data?.message || "Action Performed Successfully!", 200));
    console.log(response, "response");
    return response;
  } catch (error) {
    dispatch(returnErrors(error?.response?.data?.detail || "Error Updating Contract!", 400));
    return rejectWithValue(error.response.data);
  }
});

async function statusUpdateApi(idToken, body, id, isPayoutUpdate, updatedStatus) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };
    let response;

    if (isPayoutUpdate) {
      response = await axios.post(`${baseUrl}v2/update-payout-status/`, body, config);
    } else {
      response = await axios.patch(`${baseUrl}v2/support/case/history/${id}/`, body, config);
    }
    return response;
  } catch (error) {
    // console.log("error :", error);
    throw error;
  }
}

async function editCommentApi(idToken, body, id, stage) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };
    let response;
    // console.log("id", stage, body, id);

    if (stage === "stage") {
      response = await axios.post(`${baseUrl}support/admin/get//details/${id}/`, body, config);
    }
    if (stage === "funded") {
      response = await axios.patch(`${baseUrl}v2/get/funded/details/${id}/`, body, config);
    }
    if (stage === "payout") {
      response = await axios.post(`${baseUrl}v2/update-payout-status/`, body, config);
    }
    console.log(response, "qwerty");
    return response;
  } catch (error) {
    console.log("error :", error);
    throw error;
  }
}

async function updateContactApi(idToken, body, id) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };
    let response = await axios.patch(`${baseUrl}v2/support/case/history/${id}/`, body, config);
    return response;
  } catch (error) {
    console.log("error :", error);
    throw error;
  }
}

async function createAccountApi(idToken, body) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };
    console.log("body : ", body);
    let response = await axios.post(`${baseUrl}support/admin/create/account/`, body, config);
    return response;
  } catch (error) {
    console.log("error :", error);
    throw error;
  }
}
