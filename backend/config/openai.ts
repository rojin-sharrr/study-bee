import { RecordMetadata } from "@pinecone-database/pinecone";
import OpenAI from "openai";
import { createOpenAI } from "@ai-sdk/openai";

import * as z from "zod";
import { generateObject, generateText, tool } from "ai";
import { get } from "http";
import { getSimilarContent } from "../services/chatServices";

const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: apiKey });

const model = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})("gpt-4o-mini");

const createEmbedding = async (inputText: string) => {
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-large",
    input: inputText,
    encoding_format: "float",
  });
  console.log(`Embedding created`);
  return embedding;
};

const generateQueryResponse = async ({
  query,
  userId,
  courseId,
}: {
  query: string;
  userId: string;
  courseId: string;
}) => {
  console.log(`generateResponse of OpenAI hit`);
  const result = await generateText({
    model: model,
    tools: {
      queryResponse: tool({
        description:
          "This is a tool which should be called when you need more context about the query made by the user.",
        parameters: z.object({
          query: z.string().describe("The query to search for similar content"),
          userId: z.string().describe("The user Id of the user making the query"),
          courseId:  z.string().describe("The course'd id, of which we are getting the query from"),
        }),
        execute: getSimilarContent,
      }),
    },
    maxSteps: 10,
    prompt: `You are a friendly and knowledgeable AI tutor who helps students understand their course material. Your goal is to have natural, engaging conversations while providing accurate information.

When responding:
1. You can ONLY respond in two cases:
   a) When the user sends greetings or general conversation
   b) When you have relevant context from the queryResponse tool
2. For greetings and general conversation:
   - Be conversational and friendly
   - Use a warm, encouraging tone
   - Keep it brief and natural
3. For course-related questions:
   - ALWAYS use the queryResponse tool first
   - If the tool returns null or no context, ONLY respond with: "Sorry, no context found"
   - DO NOT attempt to answer the question if no context is found
   - When you have context, explain things in a clear, engaging way
   - Use examples and analogies when helpful
   - Break down complex concepts into simpler parts
   - IMPORTANT: Only use information from the context provided by the queryResponse tool. Never make up or assume any information.
4. Keep responses concise but conversational
5. Use natural language - avoid sounding like a textbook or search results
6. Show personality and empathy in your responses

Remember: You can ONLY respond to greetings or questions where you have context from the queryResponse tool. For all other questions without context, respond with "Sorry, no context found".

User's question: ${query} and user's userId: ${userId} and the course's courseId: ${courseId}`,
  });
  return result.text?.length !== 0
    ? result.text
    : "I'm not quite sure about that. Could you rephrase your question or provide more details?";
};


export default openai;

export { createEmbedding, generateQueryResponse };
