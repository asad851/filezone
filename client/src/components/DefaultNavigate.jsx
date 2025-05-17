import React from "react";
import { HOME, LOGIN_PATH } from "@/routes/routeUrl";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
function DefaultNavigate() {
  const { userData } = useSelector((state) => state.auth);

  return userData ? <Navigate to={HOME} /> : <Navigate to={LOGIN_PATH} />;
}

export default DefaultNavigate;
