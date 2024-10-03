import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createGroupPermissionsApi, getAdminUsersGroupsPermissions, getGroupPermissions, getGroupsList, getPermissionList } from "../../utils/api/apis";
import { returnErrors } from "../reducers/error";
import { returnMessages } from "../reducers/message";

export const fetchPermissionList = createAsyncThunk(
  "permissions/fetchPermissionList",
  async ({ idToken }, { dispatch, rejectWithValue }) => {
    try {
      const data = await getPermissionList(idToken);
      return data;
    } catch (error) {
      const msg = "Error fetching permission list";
      return rejectWithValue(error?.response?.data?.detail || msg);
    }
  }
);

export const fetchGroupsList = createAsyncThunk(
  "permissions/fetchGroupsList",
  async ({ idToken }, { dispatch, rejectWithValue }) => {
    try {
      const data = await getGroupsList(idToken);
      return data;
    } catch (error) {
      const msg = "Error fetching groups list";
      return rejectWithValue(error?.response?.data?.detail || msg);
    }
  }
);

export const createGroupPermissions = createAsyncThunk(
  "permissions/createGroupPermissions",
  async ({ idToken, groupData }, { dispatch, rejectWithValue }) => {
    try {
      const response = await createGroupPermissionsApi(idToken, groupData);
      dispatch(returnMessages("Group permissions created successfully!", 200));
      return response.data; 
    } catch (error) {
      const msg = "Error creating group permissions";
      dispatch(returnErrors(error?.response?.data?.detail || msg, 400));
      return rejectWithValue(msg);
    }
  }
);

export const fetchGroupPermissions = createAsyncThunk(
  "permissions/fetchGroupPermissions",
  async ({ idToken, id }, { dispatch, rejectWithValue }) => {
    try {
      const data = await getGroupPermissions(idToken, id);
      return data;
    } catch (error) {
      const msg = "Error fetching group permissions";
      dispatch(returnErrors(error?.response?.data?.detail || msg, 400));
      return rejectWithValue(msg);
    }
  }
);

export const fetchAdminUsersGroupsPermissions = createAsyncThunk(
  "permissions/fetchAdminUsersGroupsPermissions",
  async ({ idToken, search }, { dispatch, rejectWithValue }) => {
    try {
      const data = await getAdminUsersGroupsPermissions(idToken, search);
      return data; 
    } catch (error) {
      const msg = "Error fetching admin user groups permissions";
      dispatch(returnErrors(error?.response?.data?.detail || msg, 400));
      return rejectWithValue(msg);
    }
  }
);

const permissionSlice = createSlice({
  name: "permissions",
  initialState: {
    permissions: [],
    groups: [], 
    groupPermissions: [],
    adminUserGroupsPermissions: [], 
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPermissionList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPermissionList.fulfilled, (state, action) => {
        state.loading = false;
        state.permissions = action.payload;
      })
      .addCase(fetchPermissionList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchGroupsList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroupsList.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = action.payload; 
      })
      .addCase(fetchGroupsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(createGroupPermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGroupPermissions.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createGroupPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchGroupPermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroupPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.groupPermissions = action.payload; 
      })
      .addCase(fetchGroupPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchAdminUsersGroupsPermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminUsersGroupsPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.adminUserGroupsPermissions = action.payload; 
      })
      .addCase(fetchAdminUsersGroupsPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default permissionSlice.reducer;
