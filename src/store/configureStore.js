import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
// import themeReducer from "../utils/theme/slice";
import rootReducer from "./reducers";
// import rootSaga from "./sagas"; 
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const sagaMiddleware = createSagaMiddleware();

const persistConfig = {
  key: "equity-edge-admin-root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);


export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
});

export const persistor = persistStore(store);

export const clearPersistedData = async () => {
  await persistor.purge();
};

// sagaMiddleware.run(rootSaga);
