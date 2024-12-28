
import { AxiosError } from "axios";
import toast from "react-hot-toast";

const errorHandler = (error: unknown) => {
    console.log("Entered error handler", error)
  if (error instanceof AxiosError) {
    if (error.response) {
      const errorMessage = error.response.data.message;
      console.log(errorMessage)
      toast.error(`${errorMessage}`);
    } else if (error.request) {
        toast.error("No response from server. Please try again later.");
    } else {
        toast.error("An unexpected error occurred. Please try again.");
    }
  } else {
    toast.error("An unexpected error occurred. Please try again.");
  }
};

export default errorHandler;