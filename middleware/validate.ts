import { Request, Response, NextFunction } from "express";
import { apiHttpStatusCodes } from "../utils/apiHttpStatusCodes";
import { AnyZodObject } from "zod";
import { fromZodError } from "zod-validation-error";

export const validate = (schema: AnyZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body)
      next()
    } catch (error: any) {
      if (error) {
        const validationError = fromZodError(error)
        return res.status(apiHttpStatusCodes.STATUS_BAD_REQUEST).json({ error: true, message: validationError.toString().split(":")[1] });
      }
    }
  }
}