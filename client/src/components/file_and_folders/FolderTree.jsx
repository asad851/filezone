import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Folder } from "./FilesFolder";
import { File } from "./FilesFolder";
import { setSelectedFolder } from "@/store/segments/segmentSlice";
function FolderTree({ folders, onFolderClick, rename, setRename }) {
  const dispatch = useDispatch();
  const handleFolderClick = (folder) => {
    dispatch(setSelectedFolder(folder));
  };

  return folders?.map((item) =>
    item.isDocument === false ? (
      <Folder
        key={item.id}
        folder={item}
        onFolderClick={onFolderClick}
        handleFolderClick={handleFolderClick}
        rename={rename}
        setRename={setRename}
      />
    ) : (
      <File
        key={item.id}
        file={item}
        handleFolderClick={handleFolderClick}
        onFolderClick={onFolderClick}
        rename={rename}
        setRename={setRename}
        folder={item}
      />
    )
  );
}

export default FolderTree;
