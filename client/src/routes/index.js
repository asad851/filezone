import DefaultNavigate from "@/components/DefaultNavigate";
import Login from "@/pages/authentication/Login";
import Home from "@/pages/Home";
import { HOME, LOGIN_PATH } from "./routeUrl";

export const public_routes = [
  { path: LOGIN_PATH, element: Login },
  {
    path: "/",
    element:DefaultNavigate ,
  },
];
export const protected_routes = [{ path: HOME, element: Home }];
