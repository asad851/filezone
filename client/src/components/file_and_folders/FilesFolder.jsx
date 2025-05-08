import {
  DeleteIcon,
  EllipsisVertical,
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
import { RenamePopover } from "./RenamePopover";
import { useRef, useState } from "react";
import { useDeleteSegmentApi } from "@/helper/apis/folder/folder";
import { useDispatch, useSelector } from "react-redux";
import {
  setBreadcrumbPath,
  setCurrentFolder,
} from "@/store/segments/segmentSlice";
import { useGetSegmentQuery } from "@/helper/apis/folder/setup";
export const Folder = ({
  folder,
  onFolderClick,
  handleFolderClick,
  isSelected,
  rename,
  setRename,
}) => {
  const menuRef = useRef(null);
  const handleDoubleClick = (folder) => {
    onFolderClick(folder);
  };
  return (
    <div
      onDoubleClick={() => handleDoubleClick(folder)}
      className="` shadow p-3 max-w-70 max-h-70 flex flex-col justify-center items-center  bg-[rgb(190,219,255,0.3)] cursor-pointer rounded-md relative "
    >
      <div
        className="absolute top-2 right-2  "
        onClick={(e) => e.stopPropagation()}
        onDoubleClick={(e) => e.stopPropagation()}
      >
        <DropdownMenuEllipsis ref={menuRef} folder={folder} />
      </div>
      <FolderIcon
        height={150}
        width={150}
        className="stroke-[0.2px] fill-amber-300 "
      />
      <p className="text-xs font-medium">{folder?.name}</p>
    </div>
  );
};

export const File = ({
  file,
  folder,
  handleFolderClick,
  isSelected,
  rename,
  setRename,
  args,
}) => {
  const ext = file?.name?.split(".").pop()?.toLowerCase();

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
    <div
      className="shadow p-3 max-w-70 max-h-70 flex flex-col justify-center items-center bg-[rgb(190,219,255,0.3)] cursor-pointer overflow-hidden rounded-md relative"
      onDoubleClick={() => handleFolderClick?.(file)}
    >
      <div
        className="absolute top-2 right-2"
        onClick={(e) => e.stopPropagation()}
        onDoubleClick={(e) => e.stopPropagation()}
      >
        <DropdownMenuEllipsis folder={folder} />
      </div>

      {renderPreview()}

      <p className="text-xs font-medium max-w-4/5 truncate mt-1 text-center">
        {file?.name}
      </p>
    </div>
  );
};

export function DropdownMenuEllipsis({ folder }) {
  const dispatch = useDispatch();
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
  const handeOpen = () => {
    if (folder?.isDocument) {
      return;
    } else {
      dispatch(setCurrentFolder(folder?.children));
    }
  };
  return (
    <>
      <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
        <DropdownMenuTrigger asChild>
          <Button className="rounded-full" variant="ghost">
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={() => handeOpen()}>
              Open
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setOpenDropdown(false);
                setOpenRenameDialog(true);
              }}
            >
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleDeleteClick()}>
              Delete
              <DropdownMenuShortcut>
                <Trash />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              Move
              <DropdownMenuShortcut>
                <Move />
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
    </>
  );
}
