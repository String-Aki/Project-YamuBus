import toast from "react-hot-toast";

export const handleError = (error, fallbackMessage = "An unexpected error occurred") => {
  if (error.response && error.response.data && error.response.data.message) {
    return toast.error(error.response.data.message);
  }
  
  if (error.code && error.code.startsWith("auth/")) {
    const cleanMsg = error.code.split("/")[1].replace(/-/g, " ");
    return toast.error(cleanMsg.charAt(0).toUpperCase() + cleanMsg.slice(1));
  }

  toast.error(error.message || fallbackMessage);
};

export const handleSuccess = (message) => {
  toast.success(message, {
    style: {
      background: "#10B981",
      color: "#fff",
      fontWeight: "bold",
    },
    iconTheme: {
      primary: "#fff",
      secondary: "#10B981",
    },
  });
};