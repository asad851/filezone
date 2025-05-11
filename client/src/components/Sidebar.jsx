import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { File, FolderPlus, PlusCircleIcon } from "lucide-react";
import { useGetSegmentQuery } from "@/helper/apis/folder/setup";
import { useCreateSegmentApi } from "@/helper/apis/folder/folder";
import { useDropzone } from "react-dropzone";
import { useRef } from "react";
import NewfolderPopover from "./NewfolderPopover";
import { useSelector } from "react-redux";
import FolderFileList from "./file_and_folders/FolderFileList";
import Loader from "./loader";

export default function AppSidebar({ dragging }) {
  const folderInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const { segmentData } = useSelector((state) => state.segment);
  const { data, error, isLoading } = useGetSegmentQuery();
  const { acceptedFiles, fileRejections, getRootProps, getInputProps } =
    useDropzone({ onDrop });
  const { handleCreateSegment } = useCreateSegmentApi();

  function onDrop(acceptedFiles, event) {
    handleCreateSegment(acceptedFiles);
    // console.log(acceptedFiles)
  }

  return (
    <div className="h-full w-[30%] lg:w-[20%] py-5 ">
      <div className="pb-5 border-b-2 flex flex-col gap-5 h-[27%]">
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
        <NewfolderPopover />

        <Button onClick={() => fileInputRef.current.click()}>
          Add file
          <File />
        </Button>
      </div>
      <div
        className={`w-full h-full max-h-[74%] min-h-[425px] bg-white ${
          dragging ? "overflow-hidden" : " overflow-y-auto"
        }  overflow-x-hidden mt-3 rounded-md shadow `}
      >
        {!isLoading ? (
          <FolderFileList items={segmentData} />
        ) : (
          <div className="min-h-[420px] w-full flex items-center justify-center">
            {" "}
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
}
