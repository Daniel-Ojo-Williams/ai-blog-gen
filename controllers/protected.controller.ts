import { Request, Response } from "express";
import { apiHttpStatusCodes } from "../utils/apiHttpStatusCodes";


class Protected {
  static async protect(req: Request, res: Response){
    return res.status(apiHttpStatusCodes.STATUS_OK).send(res.locals.user)
  }
}

export default Protected;