import { Request, Response, NextFunction } from "express";
import { decodeToken } from "../utils/tokenGenerate";
import { apiHttpStatusCodes } from "../utils/apiHttpStatusCodes";
import { IUser } from "@models/users.model";

const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  try {
    // --| Get bearer token
    const token = req.header("authorization")?.split(" ")[1] as string;

    if (!token) return res.status(apiHttpStatusCodes.STATUS_FORBIDDEN).json({ error: true, message: "Unauthorized user" });
    // --| Decode bearer token
    const user = decodeToken(token);
    // --| Add decoded user to
    res.locals.user = user as Partial<IUser>;    
    next();
  } catch (e: any) {
    return res.status(apiHttpStatusCodes.STATUS_FORBIDDEN).json({ error: true, message: "Unauthorized user" });
  }
}

export default ensureAuthenticated;