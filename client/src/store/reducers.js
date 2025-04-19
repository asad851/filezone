import { combineReducers } from "redux";
import auth from "./auth/authSlice";
import { authenticationApi } from "@/helper/apis/authentication/setup";
const appReducer = combineReducers({
  auth,
  [authenticationApi.reducerPath]: authenticationApi.reducer,
});
const rootReducer = (state, action) => {
  if (action.type === "auth/logoutUser") {
    state = undefined; 
  }
  return appReducer(state, action);
};

export default rootReducer;
