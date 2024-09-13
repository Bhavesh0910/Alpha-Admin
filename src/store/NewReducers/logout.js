import { deAuthenticate } from "./authSlice";
import { resetAccountList } from "./accountList";
import { resetAccountMetrics } from "./accountMetrics";
import { resetPayout } from "./payout";



export const deAuthenticateAll = (dispatch) => {
    dispatch(resetAccountList());
    dispatch(resetAccountMetrics());
    dispatch(resetPayout());
    dispatch(deAuthenticate());
  };