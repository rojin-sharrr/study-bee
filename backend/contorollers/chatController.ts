import { Request, Response } from "express";
import { parsePDF, splitIntoPages } from "../services/pdfServices";
import PdfParse from "pdf-parse";
import {
  createSingleVectorEmbedding,
  createChunckVectorEmbedding,
  prepareChunkRecord,
  getSimilarRecords,
  queryToDB,
  generateResponse
} from "../services/chatServices";
import { createIndex, saveToDB } from "../config/db";
import {ResponseHandler} from "../utils/response"

// const uploadFile = async (req: Request, res: Response) => {
//   // Once the file has been received from the end user --> that file is in the file-uploads
//   // use fs module to parse that file --> will get the binary representation of it(buffer)
//   // Then use the pdf parsing library to get the text of the pdf

//   if (!req.file) {
//     console.log(
//       `Error uploading file in uploadFile. File not attached to req object by Multer`
//     );
//     throw new Error("Error uploading file");
//   }

//   const filepath = req.file?.path;

//   // Parses the pdf and splits into pages.
//   const pages = await splitIntoPages(filepath);

//   const vectorEmbeddings = await createChunckVectorEmbedding(pages);
//   console.log(`done creating embeddings of the file`);

//   // Preparing records for upserting.
//   const records = prepareChunkRecord(pages, vectorEmbeddings);

//   // Creating index in the database
//   // await createIndex("chatbotindex");

//   // Save to Db
//   await saveToDB(records, "chatbotindex");
//   console.log(`returned from saveToDB and now returning back response`)

//   ResponseHandler.success({
//     res,
//     message: "File Uploaded Successfully"
//   });
  
// };

const getChatbotResponse = async (req: Request, res: Response) => {
  console.log(`get chatbot response controller hit`);
    const {query, threshold} = req.body;
    const courseId = req.query.courseId as string;
    const userId = req.user?.id; // Assuming you have user info in the request
    if (!userId || !courseId) {
        throw new Error("User ID and Course ID are required");
    }

    const queryResponse = await generateResponse(query, userId, courseId);
    console.log(`response created and sent back successful`)

    res.send({
      success: true,
      data: queryResponse
    });
}

export { getChatbotResponse };
