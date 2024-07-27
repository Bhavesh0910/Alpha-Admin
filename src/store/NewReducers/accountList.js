import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {accountListReq, changeAccountStatusApi, deleteAcountApi} from "../../utils/apis/accountsApi";
import {returnErrors} from "../reducers/error";
import {returnMessages} from "../reducers/message";

export const changeAccountStatus = createAsyncThunk("accounts/changeAccountStatus", async ({idToken, body, dispatch}, {rejectWithValue}) => {
  try {
    const response = await changeAccountStatusApi(idToken, body);
    dispatch(returnMessages(response?.message || "Action Performed SuccessFully!", 200));
    dispatch(traderListRefresh());
    return response;
  } catch (error) {
    dispatch(returnErrors(error.response.data.details || "Action Failed, Try again!", 400));
    return rejectWithValue(error.response.data);
  }
});

export const deleteAcount = createAsyncThunk("accounts/deleteAcount", async ({idToken, body, platform, dispatch}, {rejectWithValue}) => {
  try {
    const response = await deleteAcountApi(idToken, body, platform);
    console.log(response);
    dispatch(returnMessages(response?.message || "Action Performed SuccessFully!", 200));
    dispatch(traderListRefresh());
    return response;
  } catch (error) {
    dispatch(returnErrors(error.response.data.details || "Action Failed, Try again!", 400));
    return rejectWithValue(error.response.data);
  }
});

// Define the async thunk for account list

export const accountList = createAsyncThunk("accounts/fetchAccountList", async ({idToken, query, platform, dispatch}, {rejectWithValue}) => {
  try {
    const response = await accountListReq(idToken, query, platform);
    return response;
  } catch (error) {
    dispatch(returnErrors(error.response.data.details || "Error Fetching Accounts, Try again!", 400));
    return rejectWithValue(error.response.data);
  }
});

const accountSlice = createSlice({
  name: "accounts",
  initialState: {
    isLoading: false,
    isError: false,
    data: [],
    login_id: null,
    totalItems: 1,
    refresh:false
  },
  reducers: {
    resetAccountList: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.data = [];
      state.login_id = null;
    },
    setDefaultLoginId: (state, action) => {
      state.login_id = action.payload;
    },
    setLoginList: (state, action) => {
      state.data = action.payload;
    },
    traderListRefresh: (state) => {
      state.refresh = !state.refresh;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(accountList.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(accountList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload?.results;
        state.totalItems = action.payload?.count;
      })
      .addCase(accountList.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(changeAccountStatus.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(changeAccountStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        // state.data = action.payload?.results;
        // state.totalItems = action.payload?.count;
      })
      .addCase(changeAccountStatus.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(deleteAcount.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(deleteAcount.fulfilled, (state, action) => {
        state.isLoading = false;
        // state.data = action.payload?.results;
        // state.totalItems = action.payload?.count;
      })
      .addCase(deleteAcount.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

// Export the async thunk and any reducers if needed
export const {resetAccountList, setDefaultLoginId, setLoginList, traderListRefresh} = accountSlice.actions;
export default accountSlice.reducer;
