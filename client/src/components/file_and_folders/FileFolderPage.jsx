import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useGetSegmentQuery } from "@/helper/apis/folder/setup";
import { setCurrentFolder } from "@/store/segments/segmentSlice";
import { FolderIcon } from "lucide-react";
import { toast } from "sonner";
import { showToast } from "@/lib/toast";

export default function FileFolderPage() {
  const dispatch = useDispatch();
  const { data, error, isLoading } = useGetSegmentQuery();

  useEffect(() => {
    dispatch(setCurrentFolder(data?.tree));
  }, [data, dispatch]);

  const handleFolderClick = (folder) => {
    const newPath = [...path, folder];
    dispatch(setCurrentFolder(folder));
  };
  const arr = Array(10).fill("name");

  return (
    <div
      className="w-full h-full max-h-[98%] overflow-y-auto px-3 py-5 grid gap-5 auto-rows-[150px]  "
      style={{
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
      }}
    >
      {arr?.map((el, id) => (
        <div
          key={id}
          className={`p-3 max-w-50 max-h-55 flex flex-col justify-center items-center  bg-[rgb(190,219,255,0.3)]`}
        >
          <FolderIcon
            height={150}
            width={150}
            className="stroke-[0.2px] fill-amber-300 "
          />
          <p className="text-xs font-medium">{el}</p>
        </div>
      ))}
    </div>
  );
}
