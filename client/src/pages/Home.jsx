import React, { useEffect, useState } from "react";
import MainContentarea from "@/components/MainContentarea";
import AppSidebar from "@/components/Sidebar";
import { Input } from "@/components/ui/input";
import {
  useCreateSegmentApi,
  useUpdateSegmentApi,
} from "@/helper/apis/folder/folder";
import { useGetSegmentQuery } from "@/helper/apis/folder/setup";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { File, Folder } from "@/components/file_and_folders/FilesFolder";
import { FileIcon, FolderIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { moveSegment, setCurrentFolder } from "@/store/segments/segmentSlice";
import {
  findFolderById,
  insertItem,
  isDescendant,
  removeItemById,
} from "@/utils/fileFolder";
import { showToast } from "@/lib/toast";
function Home() {
  const dispatch = useDispatch();
  const [draggedItem, setDraggedItem] = useState(null);
  const { handleUpdateSegment } = useUpdateSegmentApi();
  const { data, error, isLoading } = useGetSegmentQuery();
  const { handleCreateSegment } = useCreateSegmentApi();
  const { segmentData, breadcrumbPath, currentFolder } = useSelector(
    (state) => state.segment
  );
  const handleDragStart = (event) => {
    setDraggedItem(event.active.data.current);
  };
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;
    setDraggedItem(null);
    const activeId = active.id.split("/").pop();
    const overId = over.id.split("/").pop();
    const activeParentId = active?.data?.current?.item?.parentId;

    if (
      activeId === overId ||
      activeParentId === overId ||
      (activeParentId === null && overId === "movefiletoHome")
    )
      return;

    const draggedItem = active.data.current.item;
    const targetFolder = over.data.current.folder;

    if (draggedItem && targetFolder) {
      console.log(`Move '${draggedItem.name}' → into '${targetFolder.name}'`);
      const sourceItem = findFolderById(activeId, segmentData);
      const targetItem = findFolderById(overId, segmentData);
      if (isDescendant(sourceItem, overId)) {
        showToast(
          "Invalid move: Cannot move a parent into its child",
          "warning"
        );
        return;
      }

      await handleUpdateSegment({ parentId: overId }, activeId);
    }
  };
  useEffect(() => {
    let length = breadcrumbPath.length;
    let lastElem = breadcrumbPath[length - 1]?.id;
    if (length > 0) {
      let updated = findFolderById(lastElem, segmentData);
      dispatch(setCurrentFolder(updated?.children));
    }
  }, [handleDragEnd]);

  useEffect(() => {
    if (error) showToast("failed to get your files and folders", "error");
  }, [error]);
  console.log(draggedItem);
  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="w-full h-full flex gap-5 overflow-hidden ">
        <AppSidebar dragging={draggedItem} />
        <MainContentarea />
      </div>
      <DragOverlay>
        {draggedItem?.type === "file" ? (
          <div className="bg-gray-200 rounded-md shadow p-4 flex gap-5 h-max items-center">
            <FileIcon />
            <p className="text-sm font-semibold truncate">
              {draggedItem?.item?.name}
            </p>
          </div>
        ) : draggedItem?.type === "folder" ? (
          <div className="bg-gray-200 rounded-md shadow p-4 flex gap-5 h-max items-center">
            <FolderIcon />
            <p className="text-sm font-semibold truncate">
              {draggedItem?.item?.name}
            </p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default Home;
