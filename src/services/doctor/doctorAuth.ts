import apiErrorHandler from "../../utils/apiErrorHandler";
import { doctorAxiosInstance } from "../instance/doctorInstance"


export const login = async (data: { email: string, password: string }) => {
    try {
        const response = await doctorAxiosInstance.post("/auth/doctor/login", data);
        console.log("This is the response for login request from doctor", response);
        return response
    } catch (error) {
        console.log("Entered catch statement-----------------------", error);
        apiErrorHandler(error);        
    }
}