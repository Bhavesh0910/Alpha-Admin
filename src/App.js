import React from "react";
import "./App.css";
import Router from "./routes/Router";
import ErrorModal from "./components/Alerts/ErrorModal";
import SuccessModal from "./components/Alerts/SuccessModal";
import {useDispatch} from "react-redux";
import {returnErrors} from "./store/reducers/error";
import {clearPersistedData} from "./store/configureStore";
import {deAuthenticateAll} from "./store/NewReducers/logout";
import axios from "axios";

function App() {
  const dispatch = useDispatch();

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error?.response?.status === 403 || error?.response?.status === 401) {
        // if (error?.response?.status === 401) {
        if (error?.response?.data?.detail === "invalid-auth-token") {
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
