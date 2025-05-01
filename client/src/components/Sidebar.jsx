import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { File, PlusCircleIcon } from "lucide-react";
import { useGetSegmentQuery } from "@/helper/apis/folder/setup";
import { useCreateSegmentApi } from "@/helper/apis/folder/folder";
import { useDropzone } from "react-dropzone";
import { useRef } from "react";

export default function AppSidebar() {
  const folderInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const { data, error, isLoading } = useGetSegmentQuery();
  const { acceptedFiles, fileRejections, getRootProps, getInputProps } =
    useDropzone({ onDrop });
  const { handleCreateSegment } = useCreateSegmentApi();

  function onDrop(acceptedFiles, event) {
    handleCreateSegment(acceptedFiles);
    // console.log(acceptedFiles)
  }

  return (
    <div className="min-h-full w-80 py-5 ">
      <div className="py-5 border-b-2 flex flex-col gap-5">
        <div className="hidden " {...getRootProps()}>
          <input {...getInputProps({})} multiple ref={fileInputRef} />
          <input
            type="file"
            webkitdirectory=""
            hidden
            {...getInputProps({})}
            ref={folderInputRef}
          />
        </div>
        <Button onClick={() => folderInputRef.current.click()}>
          Add folder
          <PlusCircleIcon />
        </Button>

        <Button onClick={() => fileInputRef.current.click()}>
          Add file
          <File />
        </Button>
      </div>
    </div>
  );
}
