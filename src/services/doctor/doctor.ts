import apiErrorHandler from "@/utils/apiErrorHandler";
import { doctorAxiosInstance } from "../instance/doctorInstance";

export const sendCertificate = async (file: File) => {
 try {
     const formData = new FormData();
     formData.append("file", file);
       const response = await doctorAxiosInstance.post("/s3/upload", formData);
     return response;
 } catch (error) {
     apiErrorHandler(error);
         
 }
}