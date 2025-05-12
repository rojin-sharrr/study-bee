import axiosInstance from "./axios.handler";
import { IAssetModel } from "@/interfaces/IAsset";

export interface ApiResponse<T> {
    data: T | null;
    message: string;
    success: boolean;
    error: boolean;
    errorMessage?: string;
  }

const getAllAssets = async (id: string): Promise<ApiResponse<IAssetModel[]>> => {
  try {
    const assets = await axiosInstance.get(`/asset/courseid/${id}?courseId=${id}`);

    return {
        data: assets.data.data as IAssetModel[],
        message: "Assets Fetched Succesfully",
        success: true,
        error: false,
    }
  } catch (error) {
    console.log("Ran into error in function getAllAssets");
    return {
        data: null,
        message: "Error in function getAllAssets",
        success: false,
        error: true,
    };
  }
};

const deleteAsset = async (assetId: string, courseId: string) => {
    console.log(`delete asset front services hit`)
    const response = await axiosInstance.delete(`asset/${assetId}?courseId=${courseId}`);
    console.log(response.data.message);
    return response;
}

const createAnAsset = async (courseId: string, file: File): Promise<ApiResponse<any>> => {
  try {
    const formData = new FormData();
    formData.append('course_id', courseId);
    formData.append('uploaded-file', file);

    const response = await axiosInstance.post(`/asset?courseId=${courseId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      data: response.data.data,
      message: response.data.message,
      success: true,
      error: false,
    };
  } catch (error) {
    console.error("Error creating asset:", error);
    return {
      data: null,
      message: "Failed to create asset",
      success: false,
      error: true,
    };
  }
};

const viewFile = async (id: string): Promise<{ buffer: ArrayBufferLike; filename: string }> => {
  try {
    const response = await axiosInstance.get(`/asset/${id}/view`);
    console.log(response.data)
    
    // Get filename from Content-Disposition header
    const contentDisposition = response.headers['content-disposition'];
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : 'document.pdf';

    return response.data
  } catch (error) {
    console.error('Error fetching PDF:', error);
    throw error;
  }
}

export default { getAllAssets, deleteAsset, createAnAsset, viewFile };
