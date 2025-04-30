import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers";
import { authenticationApi } from "@/helper/apis/authentication/setup";
import { fileFolderApi } from "@/helper/apis/folder/setup";
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authenticationApi.middleware,
      fileFolderApi.middleware
    ),
});
export default store;
