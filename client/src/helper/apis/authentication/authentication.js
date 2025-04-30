import { useDispatch } from "react-redux";
import { usePostLoginMutation, usePostRegisterMutation } from "./setup";
import { loginUser } from "@/store/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { HOME } from "@/routes/routeUrl";
import Cookies from "js-cookie";
import { showToast } from "@/lib/toast";
export const useLoginApi = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [postLogin, { isLoading, data, error, isSuccess }] =
    usePostLoginMutation();

  const handleLogin = async (credentials) => {
    try {
      const response = await postLogin(credentials).unwrap();
      const responseData = {
        name: response?.response?.name,
        email: response?.response?.email,
        avatar: response?.response?.avatar,
      };
      Cookies.set("token", response?.response?.token);
      dispatch(loginUser(responseData));

      localStorage.setItem("userData", JSON.stringify(responseData));
      navigate(HOME);
     
      console.log("Login failed", err);
      showToast(err?.data?.errorMessage, "error");
    }
  };
  return {
    handleLogin,
    isLoading,
    isSuccess,
  };
};

export const useRegisterApi = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [postRegister, { isLoading, data }] = usePostRegisterMutation();
  const handleRegister = async (credentials) => {
    try {
      const response = await postRegister(credentials).unwrap();
      showToast("user successfully registered", "success");
      const responseData = response?.response;
      dispatch(loginUser(responseData));
      localStorage.setItem("userData", JSON.stringify(responseData));
      navigate(HOME);

    } catch (err) {
      console.log(err);
    }
  };
  return {
    handleRegister,
    isLoading,
  };
};
