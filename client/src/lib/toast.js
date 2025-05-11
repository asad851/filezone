import { toast } from "sonner";

export const showToast = (message, type = "info") => {
  const options = {
    description: message,
    duration: 4000,
    closeButton: true,
  };

  switch (type) {
    case "success":
      toast.success("Success", {
        ...options,
        className: "bg-[#a0c55f!important]",
      });
      break;
    case "error":
      toast.error("Error", { ...options, className: "bg-[#ff6b6b!important]" });
      break;
    case "warning":
      toast.warning("Warning", {
        ...options,
        className: "bg-[#eb6841!important]",
        cancel: true,
      });
      break;
    default:
      toast.info("Info", {
        ...options,
        descriptionClassName: "[color:#666666!important]",
        cancel: true,
      });
  }
};
