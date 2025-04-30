import { createSlice } from "@reduxjs/toolkit";

const authSlicer = createSlice({
  name: "auth",
  initialState: {
    userData: JSON.parse(localStorage.getItem("userData"))||null,
  },
  reducers: {
    loginUser: (state, action) => {
      state.userData = action.payload;
    },
    logoutUser: (state) => {
      state.userData = null;
    },
  },
});

export const { loginUser, logoutUser } = authSlicer.actions;
export default authSlicer.reducer;
