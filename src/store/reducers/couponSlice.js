import { createSlice } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";

const initialState = {
  coupon: [],
  isLoading: false,
  error: null,
};

const couponSlice = createSlice({
  name: "coupon",
  initialState,
  reducers: {
    getCouponData: (state,action) => {
      state.isLoading = true;
    },
    getCouponDataSuccess: (state, action) => {
      state.coupon = action.payload;
      state.isLoading = false;
    },
    getCouponDataFailure: (state) => {
      state.isLoading = false;
    },
    createCouponData: (state) => {
      state.error = null;
    },
    createCouponDataSuccess: (state, action) => {
      //
      state.couponData = action.payload;
      state.error = false;
    },
    createCouponDataFailure: (state, action) => {
      state.isLoading = false;
      state.error = true;
    },
    deleteCoupon: (state, action) => {
      //
    },
    deleteCouponSuccess: (state, action) => {
      state.coupon = state.coupon.filter(
        (coupon) => coupon.code !== action.payload
      );
    },
    setCouponData: (state, action) => {},
    setCouponDataSuccess: (state, action) => {
      if (action.payload !== null) {
        //
        return {
          ...state,
          couponData: action.payload,
        };
      } else {
        return state;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => {
      return initialState;
    });
  },
});

export const {
  getCouponData,
  getCouponDataSuccess,
  getCouponDataFailure,
  createCouponData,
  createCouponDataFailure,
  createCouponDataSuccess,
  deleteCoupon,
  deleteCouponSuccess,
  setCouponData,
  setCouponDataSuccess,
} = couponSlice.actions;
export default couponSlice.reducer;
