import { useState } from "react";
import {
  useDeleteSegmentMutation,
  useGetSegmentQuery,
  useGetUploadUrlsMutation,
  usePostCreateSegmentMutation,
  useUpdateSegmentMutation,
} from "./setup";
import { convertFilesToHierarchy } from "@/utils/fileFolder";
import { showToast } from "@/lib/toast";
import { toast } from "sonner";
import { useSelector } from "react-redux";

export const useCreateSegmentApi = () => {
  const [postCreateSegment, { data, isLoading, error }] =
    usePostCreateSegmentMutation();
  const [getUploadUrls] = useGetUploadUrlsMutation();
  const { breadcrumbPath } = useSelector((state) => state.segment);
  const parentId = breadcrumbPath[breadcrumbPath.length - 1]?.id;

  const handleCreateSegment = async (files) => {
    try {
      const urls = [];

      const { uploadUrls } = await getUploadUrls(files).unwrap();
      const promises = files.map(async (file, idx) => {
        const { uploadUrl, publicUrl } = uploadUrls[idx];

        const nameArr = file?.path?.split("/");
        const name = nameArr[nameArr.length - 1];
        // const fileRef = ref(storage, `uploads/${name}`);
        const uploadToastId = toast.loading(`Uploading ${name}...`);
        await fetch(uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        });
        toast.success(`${name} uploaded`, { id: uploadToastId });
        urls.push({ path: file?.path, url: publicUrl });
      });
      await Promise.all(promises);
      const readyFiles = files.map((file) => {
        const match = urls.find((el) => el.path === file.path);
        return { ...file, url: match?.url };
      });
      const hierarchy = convertFilesToHierarchy(readyFiles);
      const createSegmentPromises = hierarchy.map((el) =>
        postCreateSegment({ segmentTree: el, parentId: parentId || null })
      );
      await Promise.all(createSegmentPromises);
      showToast("Folder/file successfully uploaded", "success");
    } catch (err) {
      console.error(err);
      showToast("Upload failed", "error");
    }
  };
  const handleCreateFolder = async (folder) => {
    try {
      showToast("creating folder", "info");
      await postCreateSegment({
        segmentTree: folder,
        parentId: parentId || null,
      });
      showToast("folder created successfully!", "success");
    } catch (err) {
      console.log(err);
      showToast("failed to create folder", "error");
    }
  };
  return {
    handleCreateSegment,
    handleCreateFolder,
    data,
    isLoading,
    error,
  };
};

export const useUpdateSegmentApi = () => {
  const [updateSegment, { data, error, isLoading }] =
    useUpdateSegmentMutation();
  const handleUpdateSegment = async (data, id) => {
    try {
      showToast("The folder/file is getting updated, please wait!", "info");
      const res = await updateSegment({ data, id }).unwrap();
      showToast("The folder/file has been updated successfully!", "success");
    } catch (err) {
      showToast(err?.data?.errorMessage, "error");
    }
  };
  return { handleUpdateSegment };
};

export const useDeleteSegmentApi = () => {
  const [deleteSegment, { isLoading, error }] = useDeleteSegmentMutation();
  const handleDeleteSegment = async (data) => {
    try {
      showToast("Please wait while we are deleting you files/folders", "info");
      const promises = data?.map((item) => deleteSegment(item));
      await Promise.all(promises);
      showToast("The folders/files has been deleted successfully", "success");
    } catch (err) {
      showToast(err?.data?.errorMessage, "error");
    }
  };
  return {
    handleDeleteSegment,
  };
};
