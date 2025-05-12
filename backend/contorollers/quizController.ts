import { ResponseHandler } from "../utils/response";
import { Request, Response } from "express";
import verifyOwnership from "../utils/verifyOwnership";
import { findAssetById } from "../services/assetServices";
import { getCourseFromAssetId } from "../services/courseServices";
import { parsePDF, requestLLM } from "../services/pdfServices";
import quizServices from "../services/quizServices";
import { EntityQuiz, EntityQuizCourseAssets } from "../entities";
import { In } from "typeorm";

// @desc  :   Create Quiz from asset/assets
// @route :   POST api/quiz
// @access:   Private: Users
const createQuizFromAsset = async (req: Request, res: Response) => {
  console.log(`createQuizFromAsset controller hit`)
  try {
    const { assetIds, quizName, courseId } = req.body;
    console.log(`I am here `)

    if (!quizName?.trim()) {
      throw new Error("Quiz name is required");
    }


    if (!assetIds || !Array.isArray(assetIds) || assetIds.length === 0) {
      throw new Error(
        `Invalid asset IDs provided for createQuizFromAsset: ${assetIds}`
      );
    }

    // check if all the assetId's are valid.
    for (const assetId of assetIds) {
      const asset = await findAssetById(assetId);
      if (!asset) {
        throw new Error(`Asset not found: ${assetId}`);
      }
    }

    console.log(`I am here 2`)



    // Get Content from all the assets
    const assetsContent = [];
    for (const assetId of assetIds) {
      const asset = await findAssetById(assetId);
      if (!asset) {
        throw new Error(`Asset not found: ${assetId}`);
      }
      const parsedPDF = await parsePDF(asset.file);
      assetsContent.push(parsedPDF.text);
    }
    console.log(`I am here 3`)


    // Combine content and send to LLM
    const combinedContent = assetsContent.join("\n\n Next Asset \n\n");
    const quizQuestions = await requestLLM(combinedContent);

    console.log(`I am here 4`)


    // Save the quiz to the database with the name
    const savedQuiz = await quizServices.saveQuiz(
      quizQuestions,
      courseId!,
      assetIds,
      quizName.trim()
    );
    
    console.log(`I am here 5`)


    ResponseHandler.success({
      res,
      message: "Quiz Generated and Saved Successfully",
      data: savedQuiz,
    });
  } catch (error: any) {
    ResponseHandler.error({
      res,
      message: error.message || "Error while generating quiz: ",
    });
  }
};

// @desc  :   Get quiz by Id
// @route :   GET api/asset/quiz/:id
// @access:   Private: Users
const getQuizById = async (req: Request, res: Response) => {
  try {
    const quizId = req.params.id;

    const quiz = await EntityQuiz.findOne({
      where: { id: quizId },
    });

    if (!quiz) {
      throw new Error("Error in fetching quiz from quizId in getQuizById");
    }
    ResponseHandler.success({
      res,
      data: quiz,
      message: "Quiz Fetched Succesfully",
    });
  } catch (error: any) {
    ResponseHandler.error({
      res,
      message: "Error while fetching quiz in getQuizById",
    });
  }
};

// @desc  :   Get all Quizzes
// @route :   GET api/quiz/course/:id
// @access:   Private: Users
const getAllQuizzes = async (req: Request, res: Response) => {
  try {
    const courseId = req.params.id;

    const quizzes = await EntityQuizCourseAssets.find({
      where: { courseId: courseId },
      select: ["quizId"],
    });

    // Formatting the received quizIds in Object array into an array of Ids.
    const quizIds = quizzes.map((q) => q.quizId);

    // Getting all the quiz from using the quizId that we have.
    const all_quizzes = await EntityQuiz.find({
      where: {
        id: In(quizIds),
      },
    });

    ResponseHandler.success({
      res,
      data: all_quizzes,
      message: "All Quizzes fetched succesfully",
    });
  } catch (error) {
    ResponseHandler.error({
      res,
      message: "Error fetching all quizzes in getAllQuizzes",
    });
  }
};

// @desc  :   Set the Quiz's high score if the score if larger than the current score
// @route :   POST api/asset/score
// @access:   Private: Users
const setHighScore = async (req: Request, res: Response) => {
  try {
    const { quizId, score } = req.body;
    const quiz = await EntityQuiz.findOne({
      where: { id: quizId },
    });


    if (!quiz) {
      throw new Error("Not found. Quiz not found in setHighScore");
    }

    if (quiz.highScore < score) {
      await EntityQuiz.update({ id: quizId }, { highScore: score });
    } else {
      throw new Error("Provided score not greater than current high score");
    }


    ResponseHandler.success({
      res,
      message: "High score updated successfully",
      data: { score },
    });
  } catch (error: any) {
    ResponseHandler.error({
      res,
      message: error.message || "Error updating high score",
    });
  }
};

export { createQuizFromAsset, getQuizById, getAllQuizzes, setHighScore };
