import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers";
import { authenticationApi } from "@/helper/apis/authentication/setup";
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authenticationApi.middleware),
});
export default store;