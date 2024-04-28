import { Knex } from "knex";

export interface IArticle {
  id: string;
  user_id: string;
  title: string;
  content: string;
  link: string;
  created_at: Date;
  updated_at: Date;
}

class Article {
  private readonly db: Knex;

  constructor(db: Knex) {
    this.db = db;
  }

  async createArticle(article: Omit<IArticle, "created_at" | "updated_at">): Promise<void> {
    await this.db('articles').insert(article);
  }

  async getArticleById(articleId: string): Promise<IArticle | undefined> {
    const article = await this.db('articles').where({ id: articleId }).first<IArticle>();

    if (!article) return undefined;
    return article;

  }

  async getUserArticles(userId: string) {
    const articles = await this.db('articles').where({ user_id: userId }).select<IArticle[]>();

    return articles
  };

  async updateArticle(articleId: string, details: { content?: string, title?: string }) {
    const article = await this.db('articles').where({ id: articleId }).update({ ...details });
    return article;
  }

  async deleteArticle(articleId: string) {
    const article = await this.db('articles').where({ id: articleId }).del();
    return article;
  }
}

export default Article;