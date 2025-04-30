import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  segmentData: null,
  currentFolder: null,
  selectedFolder: null,
};
const segmentSlicer = createSlice({
  name: "segment",
  initialState,
  reducers: {
    setSegment: (state, action) => {
      state.segmentData = action.payload;
    },
    setCurrentFolder: (state, action) => {
      state.currentFolder = action.payload;
    },
    setSelectedFolder: (state, action) => {
      state.selectedFolder = action.payload;
    },
  },
});

export default segmentSlicer.reducer;
export const { setSegment, setCurrentFolder, setSelectedFolder } =
  segmentSlicer.actions;
