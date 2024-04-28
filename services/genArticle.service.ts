import { GoogleGenerativeAI } from "@google/generative-ai";
import env from "@config/config";

const genAI = new GoogleGenerativeAI(env.gen_ai_api_key);
const generateArticle = async (transcript: string): Promise<string> => {
  const prompt = `Based on the following transcript from a youtube video, write a comprehensive blog article, write it based on the transcript and don't make it look like a youtube video, make it look like a proper blog article:\n\n${transcript}\n\nArticle:`;

  // const prompt = 'Hello stranger, what\'s good'
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  return text;
};

export default generateArticle;
