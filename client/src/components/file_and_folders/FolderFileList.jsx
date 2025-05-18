import React, { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  FileText,
  Folder,
  FolderOpen,
  FolderIcon,
} from "lucide-react"; // Using Lucide icons for simplicity
import TooltipCommon from "../common/TooltipCommon";
import { useDispatch, useSelector } from "react-redux";
import {
  setBreadcrumbPath,
  setCurrentFolder,
} from "@/store/segments/segmentSlice";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { Filelist, FolderList } from "./Sidebarlist";

export default function FolderFileList({ items }) {
  const dispatch = useDispatch();
  const { breadcrumbPath } = useSelector((state) => state.segment);
  const [expandedFolders, setExpandedFolders] = useState({});

  const renderItems = (items, level = 0) => {
    return items?.map((item) => {
      const isFolder = !item.isDocument;

      return isFolder ? (
        <FolderList
          key={item.id}
          item={item}
          level={level}
          renderItems={renderItems}
        />
      ) : (
        <Filelist item={item} level={level} key={item.id} />
      );
    });
  };

  return (
    <div className="py-4 px-1 pb-5 h-full flex flex-col gap-1 w-full ">
      {renderItems(items)}
    </div>
  );
}
