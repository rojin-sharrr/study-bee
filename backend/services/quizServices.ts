import { EntityQuiz, EntityQuizCourseAssets } from "../entities";
import { IQuizQuestion } from "../interfaces/IQuiz";

const saveQuiz = async (
  quizzes: IQuizQuestion[], 
  courseId: string, 
  assetIds: string[],
  quizName: string
) => {
  try {
    // Create the quiz record with name
    const quiz = await EntityQuiz.create({
      highScore: 0,
      questions: quizzes,
      name: quizName
    }).save();

    // Create the quiz-course-assets record
    await EntityQuizCourseAssets.create({
      quizId: quiz.id,
      courseId: courseId,
      assetIds: assetIds
    }).save();

    return quiz;
  } catch (error) {
    console.error("Error saving quiz:", error);
    throw new Error("Failed to save quiz");
  }
};

export default { saveQuiz };
