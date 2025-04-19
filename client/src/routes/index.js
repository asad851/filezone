import DefaultNavigate from "@/components/DefaultNavigate";
import Login from "@/pages/authentication/Login";
import Home from "@/pages/Home";
import { HOME, LOGIN_PATH, REGISTER_PATH } from "./routeUrl";
import Register from "@/pages/authentication/Register";

export const public_routes = [
  { path: LOGIN_PATH, element: Login },
  { path: REGISTER_PATH, element: Register },
  {
    path: "/",
    element: DefaultNavigate,
  },
];
export const protected_routes = [{ path: HOME, element: Home }];
