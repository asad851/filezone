import { combineReducers } from "redux";
import { api } from "../helper/apiHelper";
import auth from "./auth/authSlice";
const rootReducer = combineReducers({
  auth: auth,
  [api.reducerPath]: api.reducer,
});
export default rootReducer;
