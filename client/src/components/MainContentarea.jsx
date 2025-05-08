import React, { useMemo } from "react";
import FileFolderPage from "./file_and_folders/FileFolderPage";
import { useDispatch, useSelector } from "react-redux";
import {
  setBreadcrumbPath,
  setCurrentFolder,
} from "@/store/segments/segmentSlice";
import FolderBreadcrumb from "./file_and_folders/FolderBreadcrumb";
import { findFolderById } from "@/utils/fileFolder";

function MainContentarea() {
  const dispatch = useDispatch();
  const { segmentData, breadcrumbPath } = useSelector((state) => state.segment);

  const handleBreadcrumbClick = (levelIndex) => {
    const newPath = breadcrumbPath.slice(0, levelIndex + 1);
    const id = newPath[levelIndex]?.id;
    const neededFolder = findFolderById(id, segmentData);
    dispatch(setBreadcrumbPath(newPath));
    dispatch(setCurrentFolder(neededFolder?.children));
  };

  const handleRootFolderClick = () => {
    dispatch(setBreadcrumbPath([]));
    dispatch(setCurrentFolder(segmentData));
  };

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-lg p-5 overflow-hidden">
      <div className="w-full p-3 border-b-2">
        <FolderBreadcrumb
          path={breadcrumbPath}
          onNavigate={handleBreadcrumbClick}
          onNavigateToRoot={handleRootFolderClick}
        />
      </div>
      <FileFolderPage />
    </div>
  );
}

export default MainContentarea;
