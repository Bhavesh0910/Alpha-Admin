import React from "react";
import ReactDOM from "react-dom/client";
import "./Global.config.css";
import "./index.scss";
import App from "./App";
import {Provider} from "react-redux";
import {PersistGate} from "redux-persist/lib/integration/react";
import {persistor, store} from "./store/configureStore";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <PersistGate
      loading={null}
      persistor={persistor}
    >
      <App />
    </PersistGate>
  </Provider>,
);
