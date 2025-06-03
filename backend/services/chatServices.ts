// vector embeddings service which takes array of strings and returns array of vectors: should use the
// createEmbedding function from openai.ts
import OpenAI from "openai";
import { createEmbedding, generateQueryResponse } from "../config/openai";
import { findAssetById } from "./assetServices";
import pc, { saveToDB } from "../config/db";
import {
  RecordMetadata,
  ScoredPineconeRecord,
} from "@pinecone-database/pinecone";
import Asset from "../entities/asset";
import { parsePDF, splitIntoPages } from "../services/pdfServices";

type Embedding = OpenAI.Embeddings.CreateEmbeddingResponse & {
  _request_id?: string | null;
};

/** Services of Attempt 1: embedding and upserting  */
const createSingleVectorEmbedding = async (content: string) => {
  return await createEmbedding(content);
};

const createChunckVectorEmbedding = async (pages: string[]) => {
  // write a for each loop that will go through every page in pages and will call the createSingleVectorEmbedding for that page
  // and create another array called vectorEmbeddings
  const vectorEmbeddings = [];
  for (const page of pages) {
    const vectorEmbedding = await createSingleVectorEmbedding(page);
    vectorEmbeddings.push(vectorEmbedding);
  }
  return vectorEmbeddings;
};

const prepareChunkRecord = (pages: string[], vectorEmbeddings: Embedding[]) => {
  const records = pages.map((text, i) => ({
    id: `para-${i}`,
    values: vectorEmbeddings[i].data[0].embedding,
    metadata: {
      text,
    },
  }));

  return records;
};

/** Services of Attempt2: querying */

const queryToDB = async (
  indexName: string,
  embedding: Embedding,
  threshold: number,
  namespace: string
) => {
  // Similarity search
  const index = pc.index(indexName).namespace(namespace);
  console.log(`The indexname and namespace are: ${indexName} , ${namespace}` );
  // Get the vector from embedding response object
  const queryVector = embedding.data[0].embedding;

  const queryResponse = await index.query({
    topK: 5,
    vector: queryVector,
    includeValues: false,
    includeMetadata: true,
  });

  console.log(`The query response received from pinecone db is is: ${JSON.stringify(queryResponse, null, 2)}`)

  // Filter results based on similarity threshold
  const filteredResults = queryResponse.matches.filter(
    (match) => match.score !== undefined && match.score >= threshold
  );

  return filteredResults;
};

const getSimilarRecords = async (
  query: string,
  threshold: number,
  indexName: string,
  namespace: string
) => {
  // create the embedding of the provided text
  const embedding = await createSingleVectorEmbedding(query);
  console.log(`The embedding of the QUERY is: ${embedding}`)
  console.log(
    `The query and threshold received are: ${query} and ${threshold}`
  );

  const queryResult = await queryToDB(indexName, embedding, threshold, namespace);

  return queryResult;
};

const getSimilarContent = async ({ query, userId, courseId }: { query: string, userId: string, courseId: string }) => {
  const namespace = `user-${userId}-course-${courseId}`;
  console.log("Tool input:", query, userId, courseId);
  const similarRecords = await getSimilarRecords(query, 0.1, "chatbotindex", namespace);

  if (similarRecords.length === 0) {
    return null;
  }

  const recordsWithMetadata = similarRecords.filter(
    (
      record
    ): record is ScoredPineconeRecord<RecordMetadata> & {
      metadata: RecordMetadata;
    } => record.metadata !== undefined
  );

  const similarRecordsMetadataOnly = recordsWithMetadata.map(
    (record) => record.metadata
  );

  // Extract text from metadataOnly array
  const contextTexts = similarRecordsMetadataOnly
    .map((record) => record.text)
    .join("\n\n");
  console.log(`Joined context sent back`);
  return contextTexts;
};

const generateResponse = async (query: string, userId: string, courseId: string) => {
const response = await generateQueryResponse({query, userId, courseId});
console.log(`The response returned back from the openai model based on context is: ${response}`)
  return response;
};

//todo:
const createEmbeddingsByAssetId = async (assetId: string, courseId: string, userId: string) => {
  let asset: Asset | null = null;

  try {
    asset = await findAssetById(assetId);

    if (!asset) {
      throw new Error("No asset Found: No asset for provided assetId");
    }

    console.log(`Setting the asset's embedding to PROCESSING`);
    if (asset.isEmbedding === "DRAFT") {
      asset.isEmbedding = "PROCESSING";
      await asset.save();
      console.log(`the assets embedding is: ${asset.isEmbedding}`)

      const pages = await splitIntoPages(asset.file);

      const vectorEmbeddings = await createChunckVectorEmbedding(pages);
      console.log(`done creating embeddings of the file`);

      // Preparing records for upserting.
      const records = prepareChunkRecord(pages, vectorEmbeddings);

      await saveToDB(records, "chatbotindex", courseId, userId );
      asset.isEmbedding = "COMPLETED";
      await asset.save();
      console.log(`the asset's embeddign is: ${asset.isEmbedding}`)
      return;
    }

  } catch (error) {
    if (asset) {
      asset.isEmbedding = "DRAFT";
      await asset.save();
      console.log(`Error while creating Embedding by AssetId`);
      throw new Error("Error embedding asset on draft")
    }
  }
};

export {
  createSingleVectorEmbedding,
  createChunckVectorEmbedding,
  prepareChunkRecord,
  getSimilarRecords,
  queryToDB,
  generateResponse,
  getSimilarContent,
  createEmbeddingsByAssetId,
};
