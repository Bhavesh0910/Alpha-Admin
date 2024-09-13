import React from "react";
import "./App.css";
import Router from "./routes/Router";
import ErrorModal from "./components/Alerts/ErrorModal";
import SuccessModal from "./components/Alerts/SuccessModal";
import {useDispatch, useSelector} from "react-redux";
import {returnErrors} from "./store/reducers/error";
import {clearPersistedData} from "./store/configureStore";
import {deAuthenticateAll} from "./store/NewReducers/logout";
import axios from "axios";
import { refreshTokenReq } from "./store/NewReducers/authSlice";

function App() {
  const dispatch = useDispatch();

  const {refreshToken} = useSelector(state=>state.auth)

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error?.response?.status === 403 || error?.response?.status === 401) {
        // if (error?.response?.status === 401) {
        if (error?.response?.data?.detail === "invalid-auth-token") {

          dispatch(refreshTokenReq(refreshToken))
          deAuthenticateAll(dispatch);
          clearPersistedData();
          window.location.reload();
          return Promise.reject(error);
        }
      }
      // else {
      //   if (error?.response?.status > 201) {
      //     dispatch(returnErrors("Something went wrong!!", error?.response?.status));
      //   }
      // }
      return Promise.reject(error);
    },
  );

  return (
    <div>
      <Router />
      <ErrorModal />
      <SuccessModal />
    </div>
  );
}

export default App;
