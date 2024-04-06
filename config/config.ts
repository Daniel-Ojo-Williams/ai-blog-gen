import dotenv from "dotenv";
dotenv.config({ path: '../../../.env' });

export default {
  development_url: process.env.DEV_DB_URL,
  environment: process.env.ENVIRONMENT as unknown as string,
  jwt_secret: process.env.JWT_SECRET as unknown as string
}