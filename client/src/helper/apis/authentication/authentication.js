import { useDispatch } from "react-redux";
import { usePostLoginMutation, usePostRegisterMutation } from "./setup";
import { loginUser } from "@/store/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { HOME } from "@/routes/routeUrl";

export const useLoginApi = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [postLogin, { isLoading, data, error, isSuccess }] =
    usePostLoginMutation();

  const handleLogin = async (credentials) => {
    try {
      const response = await postLogin(credentials).unwrap();
      const responseData = response?.response;
      console.log(responseData);
      dispatch(loginUser(responseData));
      localStorage.setItem("userData", JSON.stringify(responseData));
      navigate(HOME);
    } catch (err) {
      console.error("Login failed", err);
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
