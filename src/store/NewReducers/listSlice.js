import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {baseUrl, changeUserStatus, getUserList, ipLogsReq, softBlockUserApi} from "../../utils/api/apis";
import {returnErrors} from "../reducers/error";
import {returnMessages} from "../reducers/message";
import axios from "axios";

export const fetchUserList = createAsyncThunk("list/fetchUserList", async ({idToken, searchText, pageNo, pageSize, authType, active}, {dispatch, rejectWithValue}) => {
  try {
    const response = await getUserList(idToken, searchText, pageNo, pageSize, authType, active);
    if (response?.status < 399) {
      return response?.data;
    }
  } catch (error) {
    const msg = "Error fetching User list";
    dispatch(returnErrors(error?.response?.data?.detail || msg, 400));
    return rejectWithValue(msg);
  }
});

export const fetchIpLogs = createAsyncThunk("list/fetchIpLogs", async ({idToken, search, currentPage}, {dispatch, rejectWithValue}) => {
  try {
    const response = await ipLogsReq(idToken, search, currentPage);
    // if (response?.status < 399) {
    return response?.data;
    // }
  } catch (error) {
    const msg = "Error fetching IP logs";
    dispatch(returnErrors(error?.response?.data?.detail || msg, 400));
    return rejectWithValue(error?.response?.data?.detail || msg);
  }
});

export const blockOrUnblockIp = createAsyncThunk("list/blockOrUnblockIp", async ({user_email, reason, idToken, block}, {dispatch, rejectWithValue}) => {
  try {
    const response = await axios.post(`${baseUrl}block-ip/`, {user_email, reason}, {headers: {Authorization: `Bearer ${idToken}`}});
    if (response?.status < 399) {
      dispatch(returnMessages(block ? "Blocked Successfully" : "Unblocked Successfully"));
      console.log(response);
      return response.data;
    } else {
      return rejectWithValue("Error from server");
    }
  } catch (error) {
    const msg = "Error blocking/unblocking IP";
    dispatch(returnErrors(error?.response?.data?.detail || msg, 400));
    return rejectWithValue(msg);
  }
});

export const updateUser = createAsyncThunk("list/updateUser", async ({payload, idToken}, {dispatch, rejectWithValue}) => {
  console.log("idToken", idToken);
  try {
    const response = await axios.patch(`${baseUrl}profile/update/`, payload, {headers: {Authorization: `Bearer ${idToken}`}});
    if (response?.status < 399) {
      dispatch(returnMessages("Successfully Update Profile", response?.status));
    }
  } catch (error) {
    const msg = "Error in Updating Profile";
    dispatch(returnErrors(error?.response?.data?.detail || msg, 400));
    return rejectWithValue(msg);
  }
});

// Thunk to toggle active status of a user
export const toggleActiveUser = createAsyncThunk("list/toggleActiveUser", async ({id, note = "", idToken}, {rejectWithValue, dispatch}) => {
  try {
    const response = await changeUserStatus(idToken, note, id);
    dispatch(returnMessages("Status Changed Successfully"));
    console.log(response);
    return response.data; // Adjust based on your API response
  } catch (error) {
    dispatch(returnErrors(error?.response?.data?.detail || "Error changing user status", 400));
    return rejectWithValue(error.response?.data || "Error changing user status");
  }
});

export const softBlockUser = createAsyncThunk("list/softBlockUser", async ({id, note = "", idToken}, {dispatch, rejectWithValue}) => {
  try {
    const response = await softBlockUserApi(idToken, id, note);
    if (response?.status < 399) {
      dispatch(returnMessages(note === "Soft blocking user" ? "User Soft Blocked Successfully" : "User Unblocked Successfully"));
      return {id, note};
    } else {
      return rejectWithValue("Error from server");
    }
  } catch (error) {
    const msg = "Error soft blocking/unblocking user";
    dispatch(returnErrors(error?.response?.data?.detail || msg, 400));
    return rejectWithValue(msg);
  }
});

const listSlice = createSlice({
  name: "list",
  initialState: {
    tableData: [],
    ipLogsData: [],
    currentPage: 1,
    totalPages: 1,
    totalItems: 1,
    isBlockLoading: false,
    isLoading: false,
    error: null,
    flagLoading: false,
    refetch: false,
  },
  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserList.fulfilled, (state, action) => {
        console.log("action", action);

        state.isLoading = false;
        state.tableData = action.payload?.results;
        state.totalPages = Math.ceil(action.payload?.count / 21);
        state.totalItems = action.payload?.count;
      })
      .addCase(fetchUserList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchIpLogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIpLogs.fulfilled, (state, action) => {
        console.table("action.payload : ", action.payload);

        state.isLoading = false;
        state.ipLogsData = action.payload;
        state.totalPages = Math.ceil(action.payload?.count / 20);
        state.totalItems = action.payload.count;
      })
      .addCase(fetchIpLogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(blockOrUnblockIp.pending, (state) => {
        state.isBlockLoading = true;
        state.error = null;
      })
      .addCase(blockOrUnblockIp.fulfilled, (state, action) => {
        state.isBlockLoading = false;
        const {id, block} = action.payload;
      })
      .addCase(blockOrUnblockIp.rejected, (state, action) => {
        state.isBlockLoading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(toggleActiveUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(toggleActiveUser.fulfilled, (state, action) => {
        state.isLoading = false;
        // Assuming the API returns the updated user data
        const updatedUser = action.payload;
        const index = state.tableData.findIndex((user) => user.id === updatedUser.id);
        if (index !== -1) {
          state.tableData[index] = updatedUser;
        }
        state.refetch = !state.refetch;
      })
      .addCase(toggleActiveUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(updateFlagReq.pending, (state) => {
        state.flagLoading = true;
        state.error = null;
      })
      .addCase(updateFlagReq.fulfilled, (state, action) => {
        state.flagLoading = false;
        state.refetch = !state.refetch;
      })
      .addCase(updateFlagReq.rejected, (state, action) => {
        state.flagLoading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(softBlockUser.pending, (state) => {
        state.flagLoading = true;
        state.error = null;
      })
      .addCase(softBlockUser.fulfilled, (state, action) => {
        // state.flagLoading = false;
        state.refetch = !state.refetch;
      })
      .addCase(softBlockUser.rejected, (state, action) => {
        state.flagLoading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const {setPage} = listSlice.actions;

export default listSlice.reducer;

export const updateFlagReq = createAsyncThunk("list/updateFlagReq", async ({idToken, body, id}, {rejectWithValue, dispatch}) => {
  try {
    const response = await updateFlagReqApi(idToken, body, id);
    dispatch(returnMessages("Status Changed Successfully", 200));
    console.log(response);
    return response.data; // Adjust based on your API response
  } catch (error) {
    dispatch(returnErrors(error?.response?.data?.detail || "Error changing user status", 400));
    return rejectWithValue(error.response?.data || "Error changing user status");
  }
});

async function updateFlagReqApi(idToken, body, id) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };
    const res = axios.post(`${baseUrl}flag-user/${id}/`, body, config);
    return res;
  } catch (error) {
    throw error;
  }
}
