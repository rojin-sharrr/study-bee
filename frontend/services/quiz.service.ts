import axiosInstance from "./axios.handler";

const createQuizFromAssetIds = async (
  assetIds: string[],
  quizName: string,
  courseId: string
) => {
  try {
    const response = await axiosInstance.post(`/quiz?courseId=${courseId}`, {
      assetIds,
      quizName,
      courseId,
    });
    return response.data.data.id;
  } catch (error) {
    console.log(
      `An error occurred while sending request to generate quiz: ${error}`
    );
  }
};

const getQuizById = async (quizId: string, courseId: string) => {
  try {
    const quiz = await axiosInstance.get(`/quiz/${quizId}?courseId=${courseId}`);
    return quiz.data;
  } catch (error) {
    console.error(`An error occurred while fetching quiz: ${error}`);
    throw error;
  }
};

const getAllQuiz = async (courseId: string) => {
  try {
    const quizzes = await axiosInstance.get(`/quiz/course/${courseId}?courseId=${courseId}`);
    return quizzes.data.data;
  } catch (error: any) {
    console.log(`Error Occurred in getAllQuiz ${error.message}`);
  }
};

const updateHighScore = async (quizId: string, score: number, courseId: string) => {
  try {
    score = score * 10;
    await axiosInstance.post(`quiz/highscore?courseId=${courseId}`, {
      quizId,
      score,
    });
    return;
  } catch (error) {
    console.log(`Error in updateHighScore whiile updating highscore`);
  }
};

export default {
  createQuizFromAssetIds,
  getQuizById,
  getAllQuiz,
  updateHighScore,
};
