import { LOGIN_PATH } from "@/routes/routeUrl";
import React from "react";
import { Navigate } from "react-router-dom";

function DefaultNavigate() {
  return <Navigate to={LOGIN_PATH} />;
}

export default DefaultNavigate;
