import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
function FileViewerModal({ file, triggerRef }) {
  const ext = file?.name?.split(".").pop()?.toLowerCase();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button ref={triggerRef} hidden variant="outline">
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[100vw] h-full bg-transparent border-0 text-white">
        <div
          className={`w-full  flex justify-center items-center ${
            ext === "pdf" ? "h-full" : "min-h-[80%] max-h-full"
          }`}
        >
          <div
            className={`h-full  flex justify-center w-[95%] md:w-3/4 lg:w-2/3  bg-white `}
          >
            {ext === "pdf" ? (
              <iframe
                src={file?.documentKey}
                title={file?.name}
                className="w-full h-full"
              />
            ) : (
              <img
                src={file?.documentKey}
                alt={file?.name || "File preview"}
                className="object-center aspect-1/1 object-contain  h-full"
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default FileViewerModal;
