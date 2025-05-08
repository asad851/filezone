import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  segmentData: null,
  currentFolder: null,
  selectedFolder: null,
  breadcrumbPath: [],
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
    setBreadcrumbPath: (state, action) => {
      state.breadcrumbPath = action.payload;
    },
    updateCurrentFolder: (state, action) => {
      const { data, id, operation } = action.payload;

      let index = state.currentFolder.findIndex((el) => el?.id === id);
      switch (operation) {
        case "rename":
          if (index !== -1) {
            state.currentFolder[index].name = data;
          }
          break;

        case "add":
          state.currentFolder.push(data);
          break;

        default:
          break;
      }
    },
  },
});

export default segmentSlicer.reducer;
export const {
  setSegment,
  setCurrentFolder,
  setSelectedFolder,
  setBreadcrumbPath,
  updateCurrentFolder,
} = segmentSlicer.actions;
