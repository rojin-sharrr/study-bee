import { toast } from "sonner";
import axiosInstance from "./axios.handler";
import { ICourseModel } from "@/interfaces/ICourse";

export interface ApiResponse<T> {
  data: T | null;
  message: string;
  success: boolean;
  error: boolean;
  errorMessage?: string;
}

const getAllCourses = async (): Promise<ApiResponse<ICourseModel[]>> => {
  try {
    const { data } = await axiosInstance.get("/course");

    return {
      data: data.data as ICourseModel[],
      message: "Courses Fetched Succesfully",
      success: true,
      error: false,
    };
  } catch (error: any) {
    console.log("Ran into error in function getAllCourses");
    return {
      data: null,
      message: error.message,
      success: false,
      error: true,
    };
  }
};

const createCourse = async ({
  name,
  description,
}: {
  name: string;
  description: string;
}): Promise<ApiResponse<ICourseModel>> => {
  try {
    console.log(`making create course req: ${name}`)
    const { data } = await axiosInstance.post("/course/create", {
      name,
      description,
    });
    console.log(`the data received back is: ${data}`)
    console.log(data);
    return {
      data: data?.data as ICourseModel,
      message: data?.message as string,
      success: true,
      error: false,
    };
  } catch (error: any) {
    console.log(`Ran into an error in function createCourse`, error.message);
    return {
      data: null,
      message: error.messae || "Failed to create course",
      success: false,
      error: true,
    };
  }
};

const getCourseById = async (
  id: string
): Promise<ApiResponse<ICourseModel>> => {
  try {
    const { data } = await axiosInstance.get(`/course/${id}`);

    if (!data) {
      throw new Error("Failed to fetch course");
    }

    return {
      data: data.data as ICourseModel,
      message: data.message || "Course fetched successfully",
      success: true,
      error: false,
    };
  } catch (error) {
    console.error("Error fetching course:", error);
    return {
      data: null,
      message:
        error instanceof Error ? error.message : "Failed to fetch course",
      success: false,
      error: true,
    };
  }
};

const deleteCourseById = async (courseId: string) => {
  try {
    const course = await axiosInstance.delete(`/course/${courseId}`);

    return "Course Deleted Succesfully";

  } catch (error: any) {
    console.log(error?.message || "Error occurred in deleteCourseById service" );
    return "Error deleting Course"
  }
};

const getCourseAssetStatusById = async (courseId: string): Promise<boolean | null >  => {
  try {
    const { data: status} = await axiosInstance.get(`/course/${courseId}/assetstatus`);
    return status?.data;
  } catch (error: any) {
    toast.error("Error fetching Course's assets-status");
    console.log(error.message || "Error in getCourseAssetStatusById");
    return null;
  }
}

export default {
  getAllCourses,
  createCourse,
  getCourseById,
  deleteCourseById,
  getCourseAssetStatusById,
};
