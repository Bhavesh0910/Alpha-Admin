import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserList } from '../../utils/api/apis';
import { returnErrors } from '../reducers/error';

export const fetchUserList = createAsyncThunk(
  'list/fetchUserList',
  async ({ idToken, searchText , pageNo , pageSize , authType , active  }, { dispatch, rejectWithValue }) => {
    console.log(authType)
    try {
      const response = await getUserList(idToken, searchText,  pageNo, pageSize , authType , active );

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

const listSlice = createSlice({
  name: 'list',
  initialState: {
    tableData: [],
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
        state.totalItems = action.payload?.count
      })
      .addCase(fetchUserList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { setPage } = listSlice.actions;

export default listSlice.reducer;
