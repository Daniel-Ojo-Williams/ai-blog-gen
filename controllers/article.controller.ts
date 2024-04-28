import { Request, Response } from "express";
import { apiHttpStatusCodes } from "../utils/apiHttpStatusCodes";
import path from "path";
import download_video from "@services/download.service";
import transcribe from "@services/transcript.service";
import generateArticle from "@services/genArticle.service";
import Article from "@models/article.model";
import { IArticle } from "@models/article.model";
import db from "@config/db/connectdb";
import { v4 as uuid } from "uuid";
import { IUser } from "@models/users.model";
class ArticleClass {
  static async createArticle(req: Request<{}, {}, { link: string }>, res: Response<{}, { user: IUser }>) {
    try {
      const user = res.locals.user;
      const link = req.body.link;
      // --| Get title of video from youtube link after downloading audio
      const title = await download_video(link);
      
      const audioUrl = path.join(__dirname, "../../audio.mp3");
      
      // --| Get transcript
      const transcription = await transcribe(audioUrl)
      
      // --| Use Google bard to generate blog
      if (!transcription) {
        throw new Error('An error occurred while transcribing, please try again');
      }
      const article = await generateArticle(transcription);
      // --| Save blog article to database
      const newArticle = new Article(db);
      await newArticle.createArticle({ content: article, id: uuid(), link, title, user_id: user.id });

      // --| Return blog
      return res.status(apiHttpStatusCodes.STATUS_OK).json({ error: false, data: { title, article } });

    } catch (error) {
      if (error instanceof Error)
      return res.status(apiHttpStatusCodes.STATUS_INTERNAL_SERVER_ERROR).json({ error: true, message: 'Something went wrong', serverMessage: error.message })
    }
  }

  static async getAllUserArticle(req: Request<{}, {}, { user_id: string }>, res: Response) {
    try {
      const { user_id } = req.body;

      const newArticle = new Article(db);
      
    } catch (error) {
      if (error instanceof Error)
      return res.status(apiHttpStatusCodes.STATUS_INTERNAL_SERVER_ERROR).json({ error: true, message: 'Something went wrong', serverMessage: error.message })
    }
  }
}

export default ArticleClass;