import { useDispatch } from "react-redux";
import { usePostLoginMutation, usePostRegisterMutation } from "./setup";
import { loginUser } from "@/store/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { HOME } from "@/routes/routeUrl";
import Cookies from "js-cookie";
import { showToast } from "@/lib/toast";
import {
  useGetUploadUrlsMutation,
  usePostAvatarMutation,
} from "../folder/setup";
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
      showToast("User successfully logged in", "success");
      navigate(HOME);
    } catch (err) {
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
  const [postRegister, { isLoading }] = usePostRegisterMutation();
  const [getUploadUrls] = useGetUploadUrlsMutation();
  const [postAvatar] = usePostAvatarMutation();
  const handleRegister = async (credentials, file) => {
    try {
      let fileIn = file[0];
      let avatar;
      const response = await postRegister(credentials).unwrap();
      Cookies.set("token", response?.token);
      showToast("user successfully registered", "success");

      if (file) {
        const uploadUrlsData = await getUploadUrls(file).unwrap();
        showToast("Please wait while we are redirecting you to homepage!", "info");
        const { uploadUrl, publicUrl } = uploadUrlsData.uploadUrls[0];
        avatar = publicUrl;
        try {
          await fetch(uploadUrl, {
            method: "PUT",
            headers: {
              "Content-Type": fileIn.type,
            },
            body: fileIn,
          });
        } catch (err) {
          console.log(err);
        }

        await postAvatar(publicUrl);
      }
      const responseData = {
        name: response?.data?.name,
        email: response?.data?.email,
        avatar: avatar,
      };

      dispatch(loginUser(responseData));
      localStorage.setItem("userData", JSON.stringify(responseData));
      navigate(HOME);
    } catch (err) {
      showToast(err?.data?.errorMessage, "error");
      console.log(err);
    }
  };
  return {
    handleRegister,
    isLoading,
  };
};
