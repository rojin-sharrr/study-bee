import { Index, Pinecone, RecordMetadata } from "@pinecone-database/pinecone";
import OpenAI from "openai";
const apiKey = process.env.PINECONE_API_KEY!;

const pc = new Pinecone({ apiKey });

type recordType = {
  id: string;
  values: number[];
  metadata: {
    text: string;
  };
}[];

const createIndex = async (indexName: string): Promise<boolean> => {
  try {
    await pc.createIndex({
      name: indexName,
      vectorType: "dense",
      dimension: 3072,
      metric: "cosine",
      spec: {
        serverless: {
          cloud: "aws",
          region: "us-east-1",
        },
      },
      deletionProtection: "disabled",
      tags: { environment: "development" },
    });
    console.log(`Index ${indexName} created successfully`);
    return true;
  } catch (error) {
    console.error("Error in createIndex:", error);
    throw error;
  }
};

const saveToDB = async (records: recordType, indexName: string, courseId: string, userId: string) => {
  try {
    const existingIndexes = await pc.listIndexes();
    const indexExists = existingIndexes?.indexes?.find(
      (index) => index.name === indexName
    );

    if (!indexExists) {
      await createIndex(indexName);
    }

    console.log(`Number of records to upsert: ${records.length}`);
    const index = pc.index(indexName).namespace(`user-${userId}-course-${courseId}`);
    console.log(`Index fetched successfully: ${indexName}`);

    await index.upsert(records);
    console.log(`Records upserted successfully`);

    const stats = await index.describeIndexStats();
    console.log(`Current index stats:`, stats);
    return;
  } catch (error) {
    console.error("Error during upsert:", error);
    throw error;
  }
};

export default pc;

export { createIndex, saveToDB };
