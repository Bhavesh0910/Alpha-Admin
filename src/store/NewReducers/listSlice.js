import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { baseUrl, changeUserStatus, getUserList, ipLogsReq } from '../../utils/api/apis';
import { returnErrors } from '../reducers/error';
import axios from 'axios';
import { returnMessages } from '../reducers/message';

export const fetchUserList = createAsyncThunk(
  'list/fetchUserList',
  async ({ idToken, searchText, pageNo, pageSize, authType, active }, { dispatch, rejectWithValue }) => {
    try {
      const response = await getUserList(idToken, searchText, pageNo, pageSize, authType, active);
      if (response?.status < 399) {
        return response?.data;
      } else {
        const msg = 'Error getting User list';
        dispatch(returnErrors(msg, 400));
        return rejectWithValue(msg);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchIpLogs = createAsyncThunk(
  'list/fetchIpLogs',
  async ({ idToken, search, currentPage }, { dispatch, rejectWithValue }) => {
    try {
      const response = await ipLogsReq(idToken, search, currentPage);
      if (response?.status < 399) {
        return response?.data;
      } else {
        const msg = 'Error getting IP logs';
        dispatch(returnErrors(msg, 400));
        return rejectWithValue(msg);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// Thunk to toggle active status of a user
export const toggleActiveUser = createAsyncThunk(
  'user/toggleActiveUser',
  async ({ id, note = '', idToken }, { rejectWithValue, dispatch }) => {
    try {


      const response = await changeUserStatus(idToken, note , id);
      dispatch(returnMessages('Status Changes Successfully'));
      console.log(response)
        return response;


    } catch (error) {
      dispatch(returnErrors("Error", 400)); 
      return rejectWithValue(error.response.data);
    }
  }
);


const listSlice = createSlice({
  name: 'list',
  initialState: {
    tableData: [],
    ipLogsData: [],
    currentPage: 1,
    totalPages: 1,
    totalItems: 1,
    isLoading: false,
    error: null,
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
        state.isLoading = false;
        state.tableData = action.payload.results;
        state.totalPages = Math.ceil(action.payload.count / 21);
        state.totalItems = action.payload.count;
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
        state.isLoading = false;
        state.ipLogsData = action.payload.results;
        state.totalPages = Math.ceil(action.payload.count / 21);
        state.totalItems = action.payload.count;
      })
      .addCase(fetchIpLogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { setPage } = listSlice.actions;

export default listSlice.reducer;
