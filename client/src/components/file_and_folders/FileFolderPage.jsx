import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useGetSegmentQuery } from "@/helper/apis/folder/setup";
import {
  clearSelectedFolder,
  setBreadcrumbPath,
  setCurrentFolder,
  setSegment,
} from "@/store/segments/segmentSlice";
import FolderTree from "./FolderTree";
import Loader from "../loader";
import { useDroppable } from "@dnd-kit/core";
import { findFolderById } from "@/utils/fileFolder";
import FileViewerModal from "./FileViewerModal";
export default function FileFolderPage() {
  const dispatch = useDispatch();
  const { currentFolder, breadcrumbPath, segmentData } = useSelector(
    (state) => state.segment
  );
  const { data, error, isLoading } = useGetSegmentQuery();
  let currentId, folder;
  if (segmentData) {
    let last = breadcrumbPath[breadcrumbPath.length - 1];
    currentId = last?.id;
    folder = findFolderById(currentId, segmentData);
  }

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `folderpage/${currentId ? currentId : "movefiletoHome"}`,
    data: {
      type: "folder",
      folder: folder ? folder : segmentData,
    },
  });
  const [rename, setRename] = useState("");
  useEffect(() => {
    dispatch(setSegment(data?.tree));
    if (breadcrumbPath?.length === 0)
      dispatch(setCurrentFolder(data?.tree || []));
  }, [data, dispatch, breadcrumbPath]);

  const handleFolderClick = (folder) => {
    let path = { id: folder?.id, name: folder?.name };
    let newPath;
    if (breadcrumbPath.some((pth) => pth.id === folder.id)) {
      return;
    } else {
      newPath = [...breadcrumbPath, path];
    }
    dispatch(setBreadcrumbPath(newPath));
    dispatch(setCurrentFolder(folder?.children));
  };

  return !isLoading ? (
    <div
      ref={setDroppableRef}
      className={`w-full h-full max-h-[93%] overflow-y-auto px-3 py-5 grid gap-5 auto-rows-[220px] ${
        isOver ? "bg-blue-200" : ""
      } `}
      style={{
        gridTemplateColumns:
          segmentData?.length > 0
            ? "repeat(auto-fit, minmax(250px, 260px))"
            : "",
      }}
      onClick={() => dispatch(clearSelectedFolder())}
    >
      {segmentData?.length === 0 ? (
        <div className="w-full   flex justify-center items-start ">
          <img
            src="./images/notfound.svg"
            alt="not found"
            className="object-center object-contain"
          />
        </div>
      ) : (
        <FolderTree
          folders={currentFolder}
          rename={rename}
          setRename={setRename}
          onFolderClick={handleFolderClick}
        />
      )}
    </div>
  ) : (
    <Loader />
  );
}
