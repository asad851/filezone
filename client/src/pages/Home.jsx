import MainContentarea from "@/components/MainContentarea";
import AppSidebar from "@/components/Sidebar";
import { Input } from "@/components/ui/input";
import { useCreateSegmentApi } from "@/helper/apis/folder/folder";
import { useGetSegmentQuery } from "@/helper/apis/folder/setup";
import { DndContext } from "@dnd-kit/core";
import React from "react";
import { useDropzone } from "react-dropzone";
function Home() {
  const { data, error, isLoading } = useGetSegmentQuery();
  const { handleCreateSegment } = useCreateSegmentApi();
  const { acceptedFiles, fileRejections, getRootProps, getInputProps } =
    useDropzone({ onDrop });

  function onDrop(acceptedFiles, event) {
    handleCreateSegment(acceptedFiles);
    // console.log(acceptedFiles)
  }

  return (
    <DndContext>
      <div className="w-full h-full flex gap-5 ">
        <AppSidebar />
        <MainContentarea />
      </div>
    </DndContext>
  );
}

export default Home;
