import { Request, Response, NextFunction } from "express";
import { apiHttpStatusCodes } from "../utils/apiHttpStatusCodes";
import { AnyZodObject, ZodError, ZodEffects } from "zod";

export const validate = (schema: AnyZodObject | ZodEffects<any, any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body)
      next()
    } catch (error: any) {
      if (error) {
        if (error instanceof ZodError) {
          const message = error.issues.map(issue => {
            const errorMessage = issue.message;
            const errorField = issue.path[0];
            return { [errorField]: errorMessage }
          })
          return res.status(apiHttpStatusCodes.STATUS_BAD_REQUEST).json({ error: true, message });
        }
        return res.status(apiHttpStatusCodes.STATUS_BAD_REQUEST).json({ error: true, message: "Something went wrong", serverMessage: error.message });
      }
    }
  }
}