import {
  DeleteIcon,
  EllipsisVertical,
  FileIcon,
  FolderIcon,
  Move,
  Trash,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RenamePopover } from "./RenamePopover";
import { useEffect, useRef, useState } from "react";
import { useDeleteSegmentApi } from "@/helper/apis/folder/folder";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentFolder } from "@/store/segments/segmentSlice";
import { useGetSegmentQuery } from "@/helper/apis/folder/setup";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import FileViewerModal from "./FileViewerModal";

export const Folder = ({
  folder,
  onFolderClick,
  handleFolderClick,
  isSelected,
  rename,
  setRename,
}) => {
  const menuRef = useRef(null);
  const timeoutRef = useRef(null);
  const [canDrag, setCanDrag] = useState(false);
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `folder/${folder.id}`,
    data: {
      type: "folder",
      folder,
    },
  });

  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    transform,
  } = useDraggable({
    id: `folder/${folder.id}`,
    data: {
      type: "folder",
      item: folder,
    },
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });

  const [click, setClick] = useState(0);
  const mergedRef = (node) => {
    setDroppableRef(node);
    if (canDrag) setDraggableRef(node);
  };

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    touchAction: "none", // Important for mobile drag responsiveness
    userSelect: "none",
    padding: "1rem",
    cursor: "grab",
  };

  const handleDoubleClick = (folder) => {
    onFolderClick(folder);
  };
  useEffect(() => {
    if (click === 2) onFolderClick(folder);
    let timer = setTimeout(() => {
      setClick(0);
    }, 1000);
    return () => clearTimeout(timer);
  }, [click]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {transform ? (
            <div
              ref={mergedRef}
              {...attributes}
              {...listeners}
              style={style}
              className="bg-gray-200 rounded-md shadow p-4 flex gap-5 h-max items-center"
            >
              <FolderIcon />
              <p className="text-sm font-semibold truncate">{folder?.name}</p>
            </div>
          ) : (
            <div
              className={`${
                isOver ? "bg-blue-200" : "bg-gray-100"
              } shadow max-w-70 max-h-70   cursor-pointer rounded-md relative`}
              onPointerDown={(e) => {
                e.stopPropagation();
                setClick((prev) => Math.min(prev + 1, 2));
              }}
            >
              <div
                ref={mergedRef}
                {...attributes}
                {...listeners}
                style={style}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  handleDoubleClick(folder);
                }}
                className={`h-full w-full  p-3 flex flex-col justify-center items-center`}
              >
                <div
                  className="absolute top-2 right-2  "
                  onClick={(e) => e.stopPropagation()}
                  onDoubleClick={(e) => e.stopPropagation()}
                >
                  <DropdownMenuEllipsis
                    ref={menuRef}
                    folder={folder}
                    onFolderClick={onFolderClick}
                  />
                </div>
                <FolderIcon
                  height={150}
                  width={150}
                  className="stroke-[0.2px] fill-amber-300 "
                />
                <p className="text-xs font-medium">{folder?.name}</p>
              </div>
            </div>
          )}
        </TooltipTrigger>
        <TooltipContent>
          <p>{folder?.name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const File = ({
  file,
  folder,
  handleFolderClick,
  onFolderClick,
  isSelected,
  rename,
  setRename,
  args,
}) => {
  const triggerRef = useRef(null);
  const ext = file?.name?.split(".").pop()?.toLowerCase();
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `file/${file.id}`,
    data: {
      type: "file",
      item: file,
    },
  });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
  };

  const renderPreview = () => {
    if (ext === "pdf") {
      return (
        <iframe
          src={file?.documentKey}
          title={file?.name}
          className="w-4/5 h-4/5 overflow-hidden"
        />
      );
    } else if (ext === "xlsx") {
      return (
        <img
          src="/images/xlsx.png"
          alt="Excel File"
          className="w-4/5 h-4/5 object-center object-contain"
        />
      );
    } else {
      return (
        <img
          src={file?.documentKey}
          alt={file?.name || "File preview"}
          className="w-4/5 h-4/5 object-center object-contain rounded-md"
        />
      );
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {!transform ? (
              <div
                ref={setNodeRef}
                {...listeners}
                {...attributes}
                style={style}
                className={`shadow p-3 max-w-70 max-h-70 flex flex-col justify-center items-center bg-gray-100  cursor-pointer overflow-hidden rounded-md relative`}
                onDoubleClick={() => triggerRef.current.click()}
              >
                <div
                  className="absolute top-2 right-2"
                  onPointerDown={(e) => e.stopPropagation()}
                  onDoubleClick={(e) => e.stopPropagation()}
                >
                  <DropdownMenuEllipsis folder={folder} />
                </div>

                {renderPreview()}

                <p className="text-xs font-medium max-w-4/5 truncate mt-1 text-center">
                  {file?.name}
                </p>
              </div>
            ) : (
              <div
                ref={setNodeRef}
                {...listeners}
                {...attributes}
                style={style}
                className="bg-gray-200 rounded-md shadow p-4 flex gap-5 h-max items-center"
              >
                <FileIcon />
                <p className="text-sm font-semibold truncate">{file?.name}</p>
              </div>
            )}
          </TooltipTrigger>
          <TooltipContent>
            <p>{file?.name}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <FileViewerModal file={file} triggerRef={triggerRef} />
    </>
  );
};

export function DropdownMenuEllipsis({ folder, onFolderClick }) {
  const dispatch = useDispatch();
  const triggerRef = useRef(null);
  const { data } = useGetSegmentQuery();
  const { currentFolder, breadcrumbPath } = useSelector(
    (state) => state.segment
  );
  const { handleDeleteSegment } = useDeleteSegmentApi();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openRenameDialog, setOpenRenameDialog] = useState(false);
  const handleDeleteClick = async () => {
    await handleDeleteSegment(folder?.id);
    const filterDeleted = currentFolder?.filter(
      (item) => item.id !== folder?.id
    );
    dispatch(setCurrentFolder(filterDeleted));
  };
  const handeOpen = (e) => {
    e.preventDefault();
    if (folder?.isDocument) {
      triggerRef.current.click();
      setOpenDropdown(false);
    } else {
      onFolderClick(folder);
    }
  };
  return (
    <>
      <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
        <DropdownMenuTrigger asChild>
          <Button className="rounded-full hover:shadow" variant="ghost">
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onPointerDown={(e) => handeOpen(e)}>
              Open
            </DropdownMenuItem>
            <DropdownMenuItem
              onPointerDown={(e) => {
                e.preventDefault();
                setOpenDropdown(false);
                setOpenRenameDialog(true);
              }}
            >
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem onPointerDown={() => handleDeleteClick()}>
              Delete
              <DropdownMenuShortcut>
                <Trash />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <RenamePopover
        folder={folder}
        open={openRenameDialog}
        setOpenrename={setOpenRenameDialog}
      />
      <FileViewerModal file={folder} triggerRef={triggerRef} />
    </>
  );
}
