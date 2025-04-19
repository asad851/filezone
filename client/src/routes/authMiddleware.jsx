import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { LOGIN_PATH } from "./routeUrl";

function AuthMiddleware(props) {
  const { userData } = useSelector((state) => state.auth);
  console.log(userData);
  if (!userData) {
    localStorage.clear();
    return (
      <Navigate
        to={{ pathname: LOGIN_PATH, state: { from: props.location } }}
      />
    );
  } else {
    return <React.Fragment>{props.children}</React.Fragment>;
  }
}
export default AuthMiddleware;
