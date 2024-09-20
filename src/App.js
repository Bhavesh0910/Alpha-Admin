import React, {useEffect} from "react";
import "./App.css";
import Router from "./routes/Router";
import ErrorModal from "./components/Alerts/ErrorModal";
import SuccessModal from "./components/Alerts/SuccessModal";
import {useDispatch, useSelector} from "react-redux";
import {returnErrors} from "./store/reducers/error";
import {clearPersistedData} from "./store/configureStore";
import {deAuthenticateAll} from "./store/NewReducers/logout";
import axios from "axios";
import {incrementRefreshCount, refreshTokenReq} from "./store/NewReducers/authSlice";
import {v4 as uuidv4} from "uuid";

function App() {
  function handleCreateUUID() {
    let existingUUID = localStorage.getItem("user_unique_ID");

    if (!existingUUID) {
      existingUUID = uuidv4();
      localStorage.setItem("user_unique_ID", existingUUID);
    }
    axios.defaults.headers.common["x-device-id"] = existingUUID;
  }
  const dispatch = useDispatch();

  const {refreshToken, refreshCount} = useSelector((state) => state.auth);

  useEffect(() => {
    handleCreateUUID();
  }, []);

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.log("error : ",error)
      if (error?.response?.status === 403 || error?.response?.status === 401) {
        // if (error?.response?.status === 401) {
        if (error?.response?.data?.detail === "invalid-auth-token") {
          if (refreshCount >= 12) {
            deAuthenticateAll(dispatch);
            clearPersistedData();
            dispatch(incrementRefreshCount(0));
          } else {
            dispatch(refreshTokenReq(refreshToken));
            dispatch(incrementRefreshCount(refreshCount + 1));
            // window.location.reload();
          }
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
