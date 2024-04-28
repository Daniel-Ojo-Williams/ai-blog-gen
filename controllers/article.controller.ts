import { Request, Response } from "express";
import { apiHttpStatusCodes } from "../utils/apiHttpStatusCodes";
import path from "path";
import download_video from "@services/download.service";
import transcribe from "@services/transcript.service";
import generateArticle from "@services/genArticle.service";
import Article from "@models/article.model";
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

  static async getAllUserArticles(req: Request, res: Response<{}, { user: { id: string } }>) {
    try {
      const { id } = res.locals.user;

      const newArticle = new Article(db);
      const userArticles = await newArticle.getUserArticles(id);
      
      return res.status(apiHttpStatusCodes.STATUS_OK).json({ error: false, message: 'Fetched data successfully', data: userArticles });
      
    } catch (error) {
      if (error instanceof Error)
      return res.status(apiHttpStatusCodes.STATUS_INTERNAL_SERVER_ERROR).json({ error: true, message: 'Something went wrong', serverMessage: error.message })
  }
}

  static async getArticleById(req: Request<{ article_id: string }>, res: Response) {
    try {
      const { article_id } = req.params;

      const newArticle = new Article(db);
      const article = await newArticle.getArticleById(article_id);

      return res.status(apiHttpStatusCodes.STATUS_OK).json({ error: false, message: 'Fetched article successfully', data: article });
      
    } catch (error) {
        if (error instanceof Error)
        return res.status(apiHttpStatusCodes.STATUS_INTERNAL_SERVER_ERROR).json({ error: true, message: 'Something went wrong', serverMessage: error.message });      
    }
  }

  static async updateArticle(req: Request<{ article_id: string }, {}, { content?: string, title?: string }>, res: Response) {
    try {
      const { article_id } = req.params;
      const { content, title } = req.body;

      const newArticle = new Article(db);
      const article = newArticle.updateArticle(article_id, { content, title });
      if (!article) {
        return res.status(apiHttpStatusCodes.STATUS_NOT_FOUND).json({ error: true, message: 'Article not found' });
      }

      return res.status(apiHttpStatusCodes.STATUS_OK).json({ error: false, message: 'Article updated successfully' });
    } catch (error) {
      if (error instanceof Error)
      return res.status(apiHttpStatusCodes.STATUS_INTERNAL_SERVER_ERROR).json({ error: true, message: 'Something went wrong', serverMessage: error.message });           
    }
  }
  
  static async deleteArticle(req: Request<{ article_id: string }>, res: Response) {
    try {
      const { article_id } = req.params;

      const newArticle = new Article(db);
      const article = await newArticle.deleteArticle(article_id);

      if (!article) return res.status(apiHttpStatusCodes.STATUS_NOT_FOUND).json({ error: true, message: 'Article with the provided id not found' });

      return res.status(apiHttpStatusCodes.STATUS_OK).json({error: false, message: 'Article delete succesfully'});
    } catch (error) {
      if (error instanceof Error)
      return res.status(apiHttpStatusCodes.STATUS_INTERNAL_SERVER_ERROR).json({ error: true, message: 'Something went wrong', serverMessage: error.message });      
    }
  }

}

export default ArticleClass;