import React, { useState, useRef, useEffect } from "react";
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
import { findFolderById } from "@/utils/fileFolder";

export function FolderList({ item, level, renderItems }) {
  const dispatch = useDispatch();
  const { breadcrumbPath, segmentData } = useSelector((state) => state.segment);

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
    isDragging,
  } = useDraggable({
    id: `sidebarfolder/${item.id}`,
    data: {
      type: "folder",
      item: item,
    },
  });
  const [canDrag, setCanDrag] = useState(false);
  const timeoutRef = useRef(null);

  const mergedRef = (node) => {
    setDroppableRef(node);
    if (canDrag) setDraggableRef(node);
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

  const FindfolderAncestors = (folder) => {
    const ancestors = [];
    let current = folder;
    while (current?.parentId) {
      const parent = findFolderById(current.parentId, segmentData);
      if (!parent) break;
      ancestors.unshift({ id: parent.id, name: parent.name });
      current = parent;
    }

    return ancestors;
  };

  const onFileFolderDoubleClick = (item) => {
    let path = { id: item?.id, name: item?.name };
    if (breadcrumbPath.some((pth) => pth.id === item.id)) return;

    let lastBreadcrumb = path;
    const ancestors = FindfolderAncestors(item);

    const newPath = [...breadcrumbPath, ...ancestors, lastBreadcrumb];
    dispatch(setBreadcrumbPath(newPath));
    dispatch(setCurrentFolder(item?.children));
  };

  const onFolderSingleclick = (item) => {
    toggleFolder(item.id);
  };

  const handlePointerDown = (e) => {
    e.stopPropagation();
    timeoutRef.current = setTimeout(() => {
      setCanDrag(true);
    }, 300);
  };

  const handlePointerUp = () => {
    clearTimeout(timeoutRef.current);
    setCanDrag(false);
  };

  return (
    <>
      <div
        ref={mergedRef}
        {...attributes}
        {...listeners}
        key={item.id}
        style={style}
        className={`flex flex-col max-w-full w-full  hover:bg-gray-100 rounded-md p-1 pl-${
          level + 1
        } ${isOver ? "bg-blue-200" : ""} ${
          isDragging ? "cursor-[grabbing!important]" : "cursor-pointer"
        }`}
        onMouseDown={handlePointerDown}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
      >
        <div className="flex items-center gap-1 rounded-md p-1">
          {/* Drag handle only */}
          <div className="" onClick={(e) => e.stopPropagation()}>
            {isExpanded ? (
              <ChevronDown
                size={16}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  onFolderSingleclick(item);
                }}
              />
            ) : (
              <ChevronRight
                size={16}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  onFolderSingleclick(item);
                }}
              />
            )}
          </div>

          {/* Click area */}
          <div
            className="flex items-center gap-1 w-full"
            onPointerDown={(e) => {
              e.stopPropagation();
              onFileFolderDoubleClick(item);
            }}
          >
            {isExpanded ? <FolderOpen size={16} /> : <FolderIcon size={16} />}
            <span className="text-sm truncate">{item.name}</span>
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
  const [canDrag, setCanDrag] = useState(false);

  const timeoutRef = useRef(null);

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

  const handlePointerDown = (e) => {
    e.stopPropagation();
    timeoutRef.current = setTimeout(() => {
      setCanDrag(true);
    }, 300);
  };

  const handlePointerUp = () => {
    clearTimeout(timeoutRef.current);
    setCanDrag(false);
  };
  const ref = (node) => {
    if (canDrag) {
      setNodeRef(node);
    } else {
      null;
    }
  };

  return (
    <div
      onMouseDown={handlePointerDown}
      onMouseUp={handlePointerUp}
      onMouseLeave={handlePointerUp}
      ref={ref}
      {...attributes}
      {...listeners}
      style={style}
      key={item.id}
      className={`flex flex-col max-w-full w-full hover:bg-gray-100 rounded-md p-1 pl-${
        level + 1
      } ${transform ? "cursor-grabbing" : "cursor-pointer"}`}
    >
      <div className={`flex rounded-md p-1 items-center`}>
        <span className="mr-1">
          <FileText size={16} />
        </span>
        <span className="ml-1 text-sm inline-block truncate">{item.name}</span>
      </div>
    </div>
  );
}
