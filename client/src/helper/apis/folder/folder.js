import { useState } from "react";
import { useGetSegmentQuery, usePostCreateSegmentMutation } from "./setup";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase";
import { convertFilesToHierarchy } from "@/utils/fileFolder";
import { showToast } from "@/lib/toast";
export const useGetSegmentApi = () => {
  const { data, error, isLoading } = useGetSegmentQuery();
};

export const useCreateSegmentApi = () => {
  const [postCreateSegment, { data, isLoading, error }] =
    usePostCreateSegmentMutation();
  const handleCreateSegment = async (files) => {
    try {
      const urls = [];
      const promises = [...files]?.map(async (file) => {
        const nameArr = file?.path?.split("/");
        const name = nameArr[nameArr.length - 1];
        const fileRef = ref(storage, `uploads/${name}`);

        try {
          showToast(
            "You will be notified once your upload has been completed",
            "info"
          );
          const snapshot = await uploadBytes(fileRef, file);
          const downloadURL = await getDownloadURL(snapshot.ref);
          urls.push({ url: downloadURL, path: file.path });
        } catch (err) {
          console.error("Upload error", err);
          showToast(
            "There has been some error while uploading the file",
            "error"
          );
        }
      });
      await Promise.all(promises);

      const readyFiles = files?.map((file) => {
        let index = urls.findIndex((el) => el?.path === file?.path);
        return { ...file, url: urls[index]?.url };
      });

      const heirarchy = convertFilesToHierarchy(readyFiles);
      console.log(heirarchy);
      const promisesArr = heirarchy?.map(async (el) => {
        await postCreateSegment({ segmentTree: el });
      });
      await Promise.all(promisesArr);
      showToast("Folder/file successfully uploaded", "success");
    } catch (err) {
      console.log(err);
      showToast(err?.data?.errorMessage, "error");
    }
  };
  return {
    handleCreateSegment,
    data,
    isLoading,
    error,
  };
};
