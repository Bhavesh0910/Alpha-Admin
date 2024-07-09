import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import { act } from "react-dom/test-utils";
import { PURGE } from "redux-persist";
const initialState = {
  plans: { loading: true, data: [], error: false, message: "" },
  selectedChallenge: null,
  paymentHistory: {
    loading: true,
    data: [],
    error: false,
    message: "",
    lastPayment: null,
  },
  competitionList: { loading: true, data: [], error: false, message: "" },
  accountList: {
    loading: true,
    data: [],
    error: false,
    message: "",
    activeAccount: { id: null },
    activeEmail: { email: null },
    activeUser: {},
  },
  payoutList: { loading: true, data: [], error: false, message: "" },
  accountMetrics: {
    loading: false,
    data: {},
    lastUpdated: "",
    error: false,
    message: "",
  },
  traderJournal: { loading: true, data: [], error: false, message: "" },
};

const handleFailure = (state, action, reducerKey) => {
  if (reducerKey && state[reducerKey]) {
    state[reducerKey] = {
      ...state[reducerKey],
      loading: false,
      error: true,
      message: action.payload?.response?.data.detail || `Something went wrong.`,
    };
  } else {
    console.error(
      "Invalid reducerKey or state slice does not exist in handleFailure"
    );
  }
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    // Plans
    getPlans: (state, action) => {
      state.plans = { ...state.plans, loading: true, error: false };
    },
    getPlansSuccess: (state, action) => {
      state.plans = { loading: false, data: action.payload, error: false };
    },
    getPlansFailure: (state, action) => {
      handleFailure(state, action, "plans");
    },
    // Selected Challenge
    setSelectedChallenge: (state, action) => {
      // if (action.payload !== null) {
      //
      //   return action.payload;
      // } else {
      //   return null;
      // }
      state.selectedChallenge = action.payload;
    },
    // Payment History
    //NOT IMPLEMENTED YET IN THE PAGE
    getPaymentHistory: (state, action) => {
      state.paymentHistory = {
        ...state.paymentHistory,
        loading: true,
        error: false,
      };
    },
    getPaymentHistorySuccess: (state, action) => {
      state.paymentHistory = {
        ...state.paymentHistory,
        loading: false,
        data: action.payload,
        error: false,
      };
    },
    getPaymentHistoryFailure: (state, action) => {
      handleFailure(state, action, "paymentHistory");
    },
    setLastPayment: (state, action) => {
      state.paymentHistory = {
        ...state.paymentHistory,
        loading: false,
        error: false,
        lastPayment: action.payload,
      };
    },
    // Competition List
    getCompetitionList: (state, action) => {
      state.competitionList = {
        ...state.competitionList,
        loading: true,
        error: false,
      };
    },
    getCompetitionListSuccess: (state, action) => {
      state.competitionList = {
        loading: false,
        data: action.payload,
        error: false,
      };
    },
    getCompetitionListFailure: (state, action) => {
      handleFailure(state, action, "competitionList");
    },

    //Account List
    getAccountList: (state, action) => {
      state.accountList = { ...state.accountList, loading: true, error: false };
    },
    getAccountListSuccess: (state, action) => {
      // console.log(action, "active account");
      state.accountList = {
        loading: false,
        data: action.payload,
        activeAccount: {
          id: action.payload.length > 0 ? action.payload[0].login_id : null,
          timeStamp: Date.now(),
        },
      };
    },
    
    getAccountListFailure: (state, action) => {
      handleFailure(state, action, "accountList");
    },
    setActiveAccount: (state, action) => {
      state.accountList = {
        ...state.accountList,
        activeAccount: { id: action.payload, timeStamp: Date.now() },

        error: false,
      };
    },
    setActiveEmail: (state, action) => {
      state.accountList = {
        ...state.accountList,
        activeEmail: { email: action.payload, timeStamp: Date.now() },

        error: false,
      };
    },
    setActiveUser: (state, action) => {
      state.accountList = {
        ...state.accountList,
        activeUser: action.payload,

        error: false,
      };
    },
    //Account Metrics
    getAccountMetrics: (state, action) => {
      state.accountMetrics = {
        ...state.accountMetrics,
        loading: true,
        error: false,
      };
      //
    },
    getAccountMetricsSuccess: (state, action) => {
      if (action.payload.detail === "No deals found") {
        state.accountMetrics = {
          loading: false,
          data: {},
          lastUpdated: moment(Date.now()).format("D MMM YYYY HH:mm:ss"),
          error: false,
        };
      } else {
        state.accountMetrics = {
          loading: false,
          data: action.payload,
          lastUpdated: moment(Date.now()).format("D MMM YYYY HH:mm:ss"),
          error: false,
        };
      }
    },
    getAccountMetricsFailure: (state, action) => {
      handleFailure(state, action, "accountMetrics");
    },
    // Payout List
    getPayoutList: (state, action) => {
      state.payoutList = { ...state.payoutList, loading: true, error: false };
    },
    getPayoutListSuccess: (state, action) => {
      state.payoutList = { loading: false, data: action.payload };
    },
    getPayoutListFailure: (state, action) => {
      handleFailure(state, action, "payoutList");
    },

    //Trader Journal

    getTraderJournal: (state, action) => {
      state.traderJournal = {
        ...state.traderJournal,
        loading: true,
        error: false,
      };
    },
    getTraderJournalSuccess: (state, action) => {
      state.traderJournal = {
        ...state.traderJournal,
        loading: false,
        data: [...action.payload],
      };
    },
    getTraderJournalFailure: (state, action) => {
      handleFailure(state, action, "traderJournal");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => {
      return initialState;
    });
  },
});

export const {
  getPlans,
  getPlansSuccess,
  getPlansFailure,
  setSelectedChallenge,
  getPaymentHistory,
  getPaymentHistorySuccess,
  getPaymentHistoryFailure,
  setLastPayment,
  getCompetitionList,
  getCompetitionListSuccess,
  getCompetitionListFailure,
  getAccountList,
  getAccountListSuccess,
  getAccountListFailure,
  setActiveAccount,
  setActiveEmail,
  getAccountMetrics,
  getAccountMetricsSuccess,
  getAccountMetricsFailure,
  getPayoutList,
  getPayoutListSuccess,
  getPayoutListFailure,
  getTraderJournal,
  getTraderJournalSuccess,
  getTraderJournalFailure,
  setActiveUser,
} = accountSlice.actions;
export default accountSlice.reducer;
