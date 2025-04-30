import React from "react";
import FileFolderPage from "./file_and_folders/FileFolderPage";

function MainContentarea() {
  return (
    <div className="w-full h-full bg-white rounded-lg shadow-lg p-5 overflow-hidden">
      <div className="w-full p-3 border-b-2">bread</div>
      <FileFolderPage />
    </div>
  );
}

export default MainContentarea;
