import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useGetSegmentQuery } from "@/helper/apis/folder/setup";
import {
  setBreadcrumbPath,
  setCurrentFolder,
  setSegment,
} from "@/store/segments/segmentSlice";
import FolderTree from "./FolderTree";
import Loader from "../loader";

export default function FileFolderPage() {
  const dispatch = useDispatch();
  const { currentFolder, breadcrumbPath, segmentData } = useSelector(
    (state) => state.segment
  );
  const { data, error, isLoading } = useGetSegmentQuery();
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
      className="w-full h-full max-h-[93%] overflow-y-auto px-3 py-5 grid gap-5 auto-rows-[220px]  "
      style={{
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 260px))",
      }}
    >
      <FolderTree
        folders={currentFolder}
        rename={rename}
        setRename={setRename}
        onFolderClick={handleFolderClick}
      />
    </div>
  ) : (
    <Loader />
  );
}
