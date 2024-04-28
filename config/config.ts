import dotenv from "dotenv";
dotenv.config({ path: '../../../.env' });

export default {
  development_url: process.env.DEV_DB_URL,
  environment: process.env.ENVIRONMENT as unknown as string,
  jwt_secret: process.env.JWT_SECRET as unknown as string,
  yt_api_key: process.env.YOUTUBE_API_KEY as unknown as string,
  gen_ai_api_key: process.env.GEMINI_API_KEY as unknown as string,
  assembly_api_key: process.env.ASSEMBLY_API_KEY as unknown as string
};