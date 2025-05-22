import { toast } from "sonner";
import axiosHandler from "./axios.handler";

const getChatbotResponse = async (query: string, threshold: number, courseId: string, signal?: AbortSignal) => {
    try {  
        const response = await axiosHandler.post(`/chat?courseId=${courseId}`, {
            query,
            threshold,
        }, {
            signal
        });
        if (!response) {
            throw new Error("Error getting query response from backend")
        }
        return response;
    } catch (error: any) {
        if (error.name === 'CanceledError') {
            throw error;
        }
        console.log(` ${error.message}`|| `Error occourred in getChatbotResponse service` );
        toast.error("Error occurred while getting chatbot response")
    }
}

export { getChatbotResponse };
