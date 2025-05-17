import {
  findFolderById,
  insertItem,
  isDescendant,
  removeItemById,
} from "@/utils/fileFolder";
import { createSlice } from "@reduxjs/toolkit";
import { showToast } from "@/lib/toast";
const initialState = {
  segmentData: null,
  currentFolder: null,
  selectedFolder: [],
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
      const segment = action.payload;
      if (state.selectedFolder.some((el) => el.id === segment?.id)) {
        state.selectedFolder = state.selectedFolder.filter(
          (item) => item.id !== segment?.id
        );
      } else {
        state.selectedFolder.push({ id: segment?.id, name: segment?.name });
      }
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
