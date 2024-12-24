import axios from "axios";

const apiErrorHandler = (error: unknown): void => {
  if (axios.isAxiosError(error)) {
    console.error("Axios Error:", error.response?.data || error.message);
    throw error;
  } else {
    console.error("Unexpected Error:", error);
    throw new Error("An unexpected error occurred");
  }
};

export default apiErrorHandler;