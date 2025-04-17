import { createSlice } from "@reduxjs/toolkit";

const authSlicer = createSlice({
  name: "auth",
  initialState: {
    userData: null,
  },
  reducers: {
    loginUser: (state, action) => {
      state.loginUser = action.payload;
    },
  },
});

export default authSlicer.reducer;
export const {setUserData} = authSlicer.actions