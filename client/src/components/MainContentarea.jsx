import React, { useMemo } from "react";
import FileFolderPage from "./file_and_folders/FileFolderPage";
import { useDispatch, useSelector } from "react-redux";
import {
  clearSelectedFolder,
  setBreadcrumbPath,
  setCurrentFolder,
} from "@/store/segments/segmentSlice";
import FolderBreadcrumb from "./file_and_folders/FolderBreadcrumb";
import { findFolderById } from "@/utils/fileFolder";
import { Button } from "./ui/button";
import { CircleXIcon, Trash2 } from "lucide-react";
import { useDeleteSegmentApi } from "@/helper/apis/folder/folder";

function MainContentarea() {
  const dispatch = useDispatch();
  const { handleDeleteSegment } = useDeleteSegmentApi();
  const { segmentData, breadcrumbPath, selectedFolder, currentFolder } =
    useSelector((state) => state.segment);

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

  const deleteFiles = async () => {
    await handleDeleteSegment(selectedFolder);
    const updated = currentFolder.filter(
      (folder) => !selectedFolder.includes(folder?.id)
    );
    dispatch(setCurrentFolder(updated));
    dispatch(clearSelectedFolder());
  };
  return (
    <div className=" w-full  h-full bg-white rounded-lg shadow-lg p-5 overflow-hidden">
      {selectedFolder?.length < 1 ? (
        <div className="w-full p-3 border-b-2">
          <FolderBreadcrumb
            path={breadcrumbPath}
            onNavigate={handleBreadcrumbClick}
            onNavigateToRoot={handleRootFolderClick}
          />
        </div>
      ) : (
        <div className="w-full flex items-center gap-2 p-3 border-b-2">
          <CircleXIcon
            className="cursor-pointer"
            onClick={() => dispatch(clearSelectedFolder())}
          />
          <p>
            <span className="font-semibold">{selectedFolder?.length}</span>{" "}
            items selected
          </p>
          <Button className="ml-6" onClick={deleteFiles}>
            delete <Trash2 className="text-red-500" />
          </Button>
        </div>
      )}
      <FileFolderPage />
    </div>
  );
}

export default MainContentarea;
