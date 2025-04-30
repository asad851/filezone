import { combineReducers } from "redux";
import auth from "./auth/authSlice";
import { authenticationApi } from "@/helper/apis/authentication/setup";
import { fileFolderApi } from "@/helper/apis/folder/setup";
import segment from "./segments/segmentSlice";

const appReducer = combineReducers({
  auth,
  segment,
  [authenticationApi.reducerPath]: authenticationApi.reducer,
  [fileFolderApi.reducerPath]: fileFolderApi.reducer,
});

const rootReducer = (state, action) => {
  if (action.type === "auth/logoutUser") {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
