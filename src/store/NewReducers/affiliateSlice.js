import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  fetchAffiliateExport, 
  getAffiliateCodelist,
  getAffiliateListV2,
  getCodelistV2,
  getExportHistory,
  getPushleadsChartData,
  postAffiliateDetails,
  traderAffiliateRefList
} from "../../utils/api/apis";
import { returnErrors } from "../reducers/error";
import { returnMessages } from "../reducers/message";

// Thunk for fetching affiliate list
export const fetchAffiliateList = createAsyncThunk(
  "affiliate/fetchAffiliateList",
  async ({ idToken, pageNo, pageSize, searchText }, { dispatch, rejectWithValue }) => {
    try {
      const response = await getAffiliateListV2(idToken, pageNo, pageSize, searchText);
      if (response.status < 399) {
        return {
          results: response.data.results,
          count: response.data.count,
        };
      } else {
        const msg = response.response?.data?.detail || "Error getting payment list";
        dispatch(returnErrors(msg, 400));
        return rejectWithValue(msg);
      }
    } catch (error) {
      const msg = error.response?.data?.detail || "Error getting payment list";
      dispatch(returnErrors(msg, 400));
      return rejectWithValue(msg);
    }
  }
);

// Thunk for fetching affiliate export data
export const fetchAffExportData = createAsyncThunk(
  "affiliate/fetchAffExportData",
  async ({ idToken, affiliateId }, { rejectWithValue, dispatch }) => {
    try {
      const data = await fetchAffiliateExport(idToken, affiliateId);
      return data;
    } catch (error) {
      const msg = error.response?.data?.detail || "Error fetching affiliate export data";
      dispatch(returnErrors(msg, 400));
      return rejectWithValue(msg);
    }
  }
);

// Thunk for creating affiliate link
export const createAffiliateCode = createAsyncThunk(
  "affiliate/createAffiliateCode",
  async ({ idToken, couponData }, { dispatch, rejectWithValue }) => {
    try {
      const response = await postAffiliateDetails(idToken, couponData);
      dispatch(returnMessages("Successfully created coupon code", 200));
      return response;
    } catch (error) {
      const msg = error.response?.data?.detail || "Failed to create coupon";
      dispatch(returnErrors(msg, 400));
      return rejectWithValue(msg);
    }
  }
);

export const fetchReferredList = createAsyncThunk(
  "affiliate/fetchReferredList",
  async ({ idToken, affiliateId, activeTab }, { dispatch, rejectWithValue }) => {
    try {
      const response = await traderAffiliateRefList(idToken, affiliateId, activeTab);
      return response;
    } catch (error) {
      const msg = error.response?.data?.detail || "Error fetching referred list";
      dispatch(returnErrors(msg, 400));
      return rejectWithValue(msg);
    }
  }
);

export const fetchPushleadsChartData = createAsyncThunk(
  "affiliate/fetchPushleadsChartData",
  async ({ idToken, user_id }, { dispatch, rejectWithValue }) => {
    try {
      const data = await getPushleadsChartData(idToken, user_id);
      return data;
    } catch (error) {
      const msg = error.response?.data?.detail || "Error fetching pushleads chart data";
      dispatch(returnErrors(msg, 400));
      return rejectWithValue(msg);
    }
  }
);


// Thunk for fetching code list
export const fetchCodeList = createAsyncThunk(
  "affiliate/fetchCodeList",
  async ({ idToken, pageNo, pageSize, email }, { dispatch, rejectWithValue }) => {
    try {
      const response = await getCodelistV2(idToken, pageNo, pageSize, email);
      if (response.status < 399) {
        return response.data;
      } else {
        const msg = response.response?.data?.detail || "Error fetching code list";
        dispatch(returnErrors(msg, 400));
        return rejectWithValue(msg);
      }
    } catch (error) {
      const msg = error.response?.data?.detail || "Error fetching code list";
      dispatch(returnErrors(msg, 400));
      return rejectWithValue(msg);
    }
  }
);

// Thunk for fetching new affiliate code list
export const fetchNewAffiliateCodeList = createAsyncThunk(
  "v2/list/affiliate-code/",
  async ({ idToken, pageNo, pageSize, searchText }, { dispatch, rejectWithValue }) => {
    try {
      const response = await getAffiliateCodelist(idToken, pageNo, pageSize, searchText);
      if (response.status < 399) {
        return response.data;
      } else {
        const msg = response.response?.data?.detail || "Error fetching code list";
        dispatch(returnErrors(msg, 400));
        return rejectWithValue(msg);
      }
    } catch (error) {
      const msg = error.response?.data?.detail || "Error fetching code list";
      dispatch(returnErrors(msg, 400));
      return rejectWithValue(msg);
    }
  }
);

// Thunk for fetching export history
export const fetchExportHistory = createAsyncThunk(
  'affiliate/fetchExportHistory',
  async ({ idToken, pageNo, pageSize }, { dispatch, rejectWithValue }) => {
    try {
      const response = await getExportHistory(idToken, pageNo, pageSize);
      if (response.status < 399) {
        return response.data;
      } else {
        const msg = response.response?.data?.detail || 'Error fetching export history';
        dispatch(returnErrors(msg, 400));
        return rejectWithValue(msg);
      }
    } catch (error) {
      const msg = error.response?.data?.detail || 'Error fetching export history';
      dispatch(returnErrors(msg, 400));
      return rejectWithValue(msg);
    }
  }
);

const affiliateSlice = createSlice({
  name: 'affiliate',
  initialState: {
    affiliateData: [],
    codeData: [],
    newCodeListData: [],
    exportHistoryData: [], 
    affiliateExportData: null,
    referredList: [],
    pushleadsChartData: null,
    currentPage: 1,
    totalPages: 1,
    isLoading: false,
    error: null,
    createdLink: '',
    totalItems: 1,
  },
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAffiliateList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAffiliateList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.affiliateData = action.payload.results;
        state.totalPages = Math.ceil(action.payload.count / 21);
        state.totalItems = action.payload?.count;
      })
      .addCase(fetchAffiliateList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createAffiliateCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createAffiliateCode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.createdLink = action.payload.url;
      })
      .addCase(createAffiliateCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchCodeList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCodeList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.codeData = action.payload.results;
        state.totalItems = action.payload?.count;
      })
      .addCase(fetchCodeList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchNewAffiliateCodeList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNewAffiliateCodeList.fulfilled, (state, action) => {
        state.newCodeListData = action.payload;
        state.totalPages = Math.ceil(action.payload.count / 20);
        state.totalItems = action.payload?.count;
        state.isLoading = false;
      })
      .addCase(fetchNewAffiliateCodeList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchExportHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExportHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.exportHistoryData = action.payload;
        state.totalPages = Math.ceil(action.payload.count / 20);
        state.totalItems = action.payload?.count;
      })
      .addCase(fetchExportHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchAffExportData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAffExportData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.affiliateExportData = action.payload;
      })
      .addCase(fetchAffExportData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchReferredList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReferredList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.referredList = action.payload;
      })
      .addCase(fetchReferredList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchPushleadsChartData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPushleadsChartData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pushleadsChartData = action.payload;
      })
      .addCase(fetchPushleadsChartData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentPage } = affiliateSlice.actions;

export default affiliateSlice.reducer;
