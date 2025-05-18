import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { FolderPlus } from "lucide-react";
import { useCreateSegmentApi } from "@/helper/apis/folder/folder";
import { showToast } from "@/lib/toast";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentFolder,
  updateCurrentFolder,
} from "@/store/segments/segmentSlice";
import { findFolderById } from "@/utils/fileFolder";
export default function NewfolderPopover() {
  const dispatch = useDispatch();
  const { breadcrumbPath, currentFolder } = useSelector(
    (state) => state.segment
  );
  const { handleCreateFolder, data } = useCreateSegmentApi();
  const [value, setValue] = useState("");
  const operationAfterClick = () => setValue("");
  const handleCreate = async () => {
    let newFolder = {
      name: value,
      isDocument: false,
      documentKey: null,
      children: [],
    };

    if (value) {
      if (
        currentFolder.some(
          (folder) => folder.name.toLowerCase() === value.toLowerCase()
        )
      ) {
        showToast(
          `This destination already contains a folder named "${value}"`,
          "error"
        );
        operationAfterClick();
        return;
      }
      await handleCreateFolder(newFolder);
      let segmentId = breadcrumbPath[breadcrumbPath.length - 1]?.id;
      const updatedFolder = findFolderById(segmentId, data?.response?.tree);
      console.log(updatedFolder);
      dispatch(setCurrentFolder(updatedFolder.children));
      operationAfterClick();
    } else {
      showToast("please type a name for the folder", "error");
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>
          {" "}
          New folder
          <FolderPlus />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create New Folder</AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>
          <div className="py-2">
            <Input
              type="text"
              placeholder="Enter name for the folder"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="text-gray-700"
            />
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={operationAfterClick}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleCreate}>create</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
