import React, { useState } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import {
  ChevronRight,
  ChevronDown,
  FileText,
  FolderOpen,
  FolderIcon,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  setBreadcrumbPath,
  setCurrentFolder,
} from "@/store/segments/segmentSlice";

export function FolderList({ item, level, renderItems }) {
  const dispatch = useDispatch();
  const { breadcrumbPath } = useSelector((state) => state.segment);

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `sidebarfolder/${item.id}`,
    data: {
      type: "folder",
      folder: item,
    },
  });

  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    transform,
  } = useDraggable({
    id: `sidebarfolder/${item.id}`,
    data: {
      type: "folder",
      item: item,
    },
  });

  const mergedRef = (node) => {
    setDroppableRef(node);
  };

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
  };

  const [expandedFolders, setExpandedFolders] = useState({});
  const isExpanded = expandedFolders[item.id];

  const toggleFolder = (id) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const onFileFolderDoubleClick = (item) => {
    let path = { id: item?.id, name: item?.name };
    if (breadcrumbPath.some((pth) => pth.id === item.id)) return;

    const newPath = [...breadcrumbPath, path];
    dispatch(setBreadcrumbPath(newPath));
    dispatch(setCurrentFolder(item?.children));
  };

  const onFolderSingleclick = (item) => {
    toggleFolder(item.id);
  };

  return (
    <>
      <div
        ref={mergedRef}
        key={item.id}
        style={style}
        className={`flex flex-col max-w-full w-full cursor-pointer hover:bg-gray-100 rounded-md p-1 pl-${
          level + 1
        } ${isOver ? "bg-blue-200" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div
          className="flex items-center gap-1 rounded-md p-1"
          onClick={(e) => {
            e.stopPropagation();
            onFileFolderDoubleClick(item);
          }}
        >
          {isExpanded ? (
            <ChevronDown
              onClick={(e) => {
                e.stopPropagation();
                onFolderSingleclick(item);
              }}
              size={16}
            />
          ) : (
            <ChevronRight
              onClick={(e) => {
                e.stopPropagation();
                onFolderSingleclick(item);
              }}
              size={16}
            />
          )}

          <div
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              onFileFolderDoubleClick(item);
            }}
          >
            <div
              ref={setDraggableRef}
              {...attributes}
              {...listeners}
              className="flex items-center gap-1 w-full "
            >
              {isExpanded ? <FolderOpen size={16} /> : <FolderIcon size={16} />}
              <span className="text-sm truncate">{item.name}</span>
            </div>
          </div>
        </div>
      </div>

      {isExpanded && item.children && (
        <div className={`pt-1 w-full flex flex-col gap-1 pl-${level}`}>
          {renderItems(item.children, level + 1)}
        </div>
      )}
    </>
  );
}

export function Filelist({ item, level }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `sidebarfile/${item.id}`,
    data: {
      type: "file",
      item: item,
    },
  });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
  };
  return (
    <>
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        style={style}
        key={item.id}
        className={`flex flex-col max-w-full w-full   hover:bg-gray-100  rounded-md p-1 pl-${
          level + 1
        } ${transform ? "cursor-grabbing" : "cursor-pointer"}`}
      >
        <div className={`flex   rounded-md p-1 `}>
          <span className="mr-1">
            <FileText size={16} />
          </span>
          <span className="ml-1  text-sm inline-block   truncate">
            {item.name}
          </span>
        </div>
      </div>
    </>
  );
}
