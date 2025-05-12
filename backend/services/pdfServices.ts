// Move all the logic to the service layer
import fs from "fs";
import pdfParse from "pdf-parse";
import { Request, Response } from "express";
import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import * as z from "zod";
import { PROMPTS } from "../config/prompts";

import { EntityAsset, EntityAssetCourse } from "../entities";

const myOutputSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string(),
      options: z.array(z.string()),
      answer_index: z.number(),
      right_answer_reason: z
        .string()
        .describe("Give why the right answer is correct"),
    })
  ),
});

const model = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})("gpt-4o-mini");


interface QuizData {
  question: string;
  options: string[];
  answer_index: number;
}

const parsePDF = async (filePath: string) => {
  // Picking the file from local machine and reading it in raw Binary foramt: into Buffer
  const existingPdfByte = fs.readFileSync(filePath);
  // Now parsing the pdf
  const parsedPDF = await pdfParse(existingPdfByte);
  return parsedPDF;
};

const requestLLM = async (pdf: string) => {
  const {
    object: { questions },
    usage,
  } = await generateObject({
    model,
    schema: myOutputSchema,
    prompt: PROMPTS.quizPrompt(pdf),
  });

  return questions;
};

const saveDB = async (
  fileName: string | undefined,
  fileType: string | undefined,
  file: string | undefined,
  course_id: string | undefined,
) => {


  const asset = await EntityAsset.create({
    name: fileName,
    fileType,
    file,
  }).save();


  const asset_id = asset.id;

  // Saving to the asset-course as well
  await EntityAssetCourse.create({
    course_id,
    asset_id,
  }).save();

  return;
};

export { parsePDF, requestLLM, saveDB };
