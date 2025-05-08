import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { useUpdateSegmentApi } from "@/helper/apis/folder/folder";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentFolder,
  updateCurrentFolder,
} from "@/store/segments/segmentSlice";
export function RenamePopover({ folder, open, setOpenrename }) {
  const dispatch = useDispatch();
  const { currentFolder } = useSelector((state) => state.segment);
  const { handleUpdateSegment } = useUpdateSegmentApi();
  const [value, setValue] = useState(folder?.name || "");
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);
  return (
    open && (
      <AlertDialog open={open} onOpenChange={setOpenrename}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Rename {folder?.isDocument ? "file" : "folder"} "{folder?.name}"
            </AlertDialogTitle>
          </AlertDialogHeader>

          <div className="py-2">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Enter the new name"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="text-gray-700"
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setOpenrename(false);
                setValue("");
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await handleUpdateSegment({ name: value }, folder?.id);
                dispatch(
                  updateCurrentFolder({
                    operation: "rename",
                    id: folder?.id,
                    data: value,
                  })
                );
                setValue("");
                setOpenrename(false);
              }}
            >
              Rename
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  );
}
