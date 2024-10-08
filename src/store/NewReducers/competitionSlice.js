import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {getCompDetails, postCompDetails, getOneCompDetails, updateCompDetails, getLeaderboardDetails, deleteCompDetails, getCompTableDetails, getCompDashboardChart, getCompLeaderboardStats} from "../../utils/api/apis";
import {returnErrors} from "../reducers/error";
import {returnMessages} from "../reducers/message";

export const fetchCompDetails = createAsyncThunk("comp/fetchCompDetails", async (idToken, {dispatch, rejectWithValue}) => {
  try {
    const response = await getCompDetails(idToken);
    if (response?.status < 399) {
      return response?.data;
    } else {
      const msg = "Failed to fetch competitions list";
      dispatch(returnErrors(msg, 400));
      return rejectWithValue(msg);
    }
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const fetchLeaderboard = createAsyncThunk("comp/fetchLeaderboard", async ({idToken, competitionId}, {dispatch, rejectWithValue}) => {
  try {
    const response = await getLeaderboardDetails(idToken, competitionId);
    if (response?.status < 399) {
      return response?.data;
    } else {
      const msg = "Failed to fetch leaderboard details";
      dispatch(returnErrors(msg, 400));
      return rejectWithValue(msg);
    }
  } catch (error) {
    return rejectWithValue(error.message);
  }
});
export const fetchCompetitionDetail = createAsyncThunk("comp/fetchCompetitionDetail", async ({idToken, id}, {dispatch, rejectWithValue}) => {
  try {
    const response = await getOneCompDetails(idToken, id);
    if (response?.status < 399) {
      return response?.data;
    }
  } catch (error) {
    const msg = error.response?.data?.detail || "Failed to fetch competition details";
    const status = error.response?.status || 500;
    dispatch(returnErrors(msg, status));
    return rejectWithValue(msg);
  }
});

export const createCompetition = createAsyncThunk("comp/createCompetition", async ({idToken, formData}, {dispatch, rejectWithValue}) => {
  try {
    const response = await postCompDetails(idToken, formData);
    console.log(response);
    dispatch(returnMessages("Successfully created competition", 200));
    return response?.data;
  } catch (error) {
    const msg = error.response?.data?.detail || "Error creating competition";
    const status = error.response?.status || 500;
    dispatch(returnErrors(msg, status));
    return rejectWithValue(msg);
  }
});

export const updateCompetition = createAsyncThunk("comp/updateCompetition", async ({idToken, id, updatedData}, {dispatch, rejectWithValue}) => {
  console.log(id, updatedData);
  try {
    const response = await updateCompDetails(idToken, id, updatedData);
    dispatch(returnMessages("Successfully updated competition", 200));
    return response?.data;
  } catch (error) {
    const msg = error.response?.data?.detail || "Error updating competition";
    const status = error.response?.status || 500;
    dispatch(returnErrors(msg, status));
    return rejectWithValue(msg);
  }
});

export const deleteCompetition = createAsyncThunk("comp/deleteCompetition", async ({idToken, id}, {dispatch, rejectWithValue}) => {
  try {
    const response = await deleteCompDetails(idToken, id);
    dispatch(returnMessages("Competition deleted successfully", 200));
    return id;
  } catch (error) {
    const msg = error.response?.data?.detail || "Error deleting competition";
    const status = error.response?.status || 500;
    dispatch(returnErrors(msg, status));
    return rejectWithValue(msg);
  }
});

export const fetchCompTableDetails = createAsyncThunk("comp/compTableDetails", async ({idToken, id}, {dispatch, rejectWithValue}) => {
  try {
    const response = await getCompTableDetails(idToken, id);
    return response?.data;
  } catch (error) {
    const msg = error.response?.data?.detail || "Error fetching competition details";
    const status = error.response?.status || 500;
    dispatch(returnErrors(msg, status));
    return rejectWithValue(msg);
  }
});

export const fetchCompDashboard = createAsyncThunk("comp/compDashboard", async ({idToken, id}, {dispatch, rejectWithValue}) => {
  try {
    const response = await getCompDashboardChart(idToken, id);
    return response?.data;
  } catch (error) {
    const msg = error.response?.data?.detail || "Error fetching competition dashboard chart";
    const status = error.response?.status || 500;
    dispatch(returnErrors(msg, status));
    return rejectWithValue(msg);
  }
});


const initialState = {
  compData: [],
  compTableData: [],
  competitionDetail: null,
  compDashboard:null,

  leaderboardData: null,
  isLoading: false,
  error: null,
};

const compSlice = createSlice({
  name: "comp",
  initialState,
  reducers: {
    deleteComp: (state, action) => {
      state.compData = state.compData.filter((comp) => comp.id !== action.payload);
    },
    clearCompetitionDetail: (state) => {
      state.competitionDetail = null;
    },
    clearLeaderboardData: (state) => {
      state.leaderboardData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompTableDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCompTableDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        // console.log("action.payload : ", action.payload.leaderboard);
        state.compTableData = action?.payload?.leaderboard;
      })
      .addCase(fetchCompTableDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchCompDashboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCompDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log("action.payload : ", action?.payload);
        state.compDashboard = action?.payload;
      })
      .addCase(fetchCompDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchCompDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCompDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.compData = action.payload;
      })
      .addCase(fetchCompDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchCompetitionDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCompetitionDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.competitionDetail = action.payload;
      })
      .addCase(fetchCompetitionDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(createCompetition.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCompetition.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(createCompetition.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(updateCompetition.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCompetition.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateCompetition.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchLeaderboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leaderboardData = action.payload;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteCompetition.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCompetition.fulfilled, (state, action) => {
        state.isLoading = false;
        state.compData = state.compData.filter((comp) => comp.id !== action.payload);
      })
      .addCase(deleteCompetition.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const {deleteComp, clearCompetitionDetail, clearLeaderboardData} = compSlice.actions;

export default compSlice.reducer;
