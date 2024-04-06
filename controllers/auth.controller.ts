import { Request, Response } from "express";
import User, { IUser } from "@models/users.model";
import db from "@config/db/connectdb";
import { v4 as uuid } from "uuid";
import { apiHttpStatusCodes } from "../utils/apiHttpStatusCodes";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/tokenGenerate";

class UserController {
  static async registerUser(req: Request<{}, {}, Omit<IUser, "created_at" | "updated_at">>, res: Response){
    try {
      const { first_name, last_name, email, password } = req.body;
      // --| Add user to db
      const user = new User(db);
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt)
      await user.create({ email, password: hashedPassword, first_name, last_name, id: uuid()})
      return res.status(apiHttpStatusCodes.STATUS_CREATED).json({ error: false, message: "User created successfully" });
    } catch(e: any){
      if (e.code === "23505") {
        return res.status(apiHttpStatusCodes.STATUS_CONFLICT).json({ error: true, message: "Something went wrong, please try again", serverMessage: "Account with the email exists, login" })
      }
      return res.status(apiHttpStatusCodes.STATUS_INTERNAL_SERVER_ERROR).json({ error: true, message: "Something went wrong, please try again", serverMessage: e.message})
    }
  }

  static async loginUser(req: Request<{}, {}, IUser>, res: Response){
    try {
      const { email, password } = req.body;
      // --Check if user exists
      const user = new User(db);
      let existingUser = await user.findUserByEmail(email);

      if (!existingUser) return res.status(apiHttpStatusCodes.STATUS_NOT_FOUND).json({ error: true, message: "Invalid credentials" });

      const passwordMatch = await bcrypt.compare(password, existingUser.password);

      if (!passwordMatch) return res.status(apiHttpStatusCodes.STATUS_UNAUTHORIZED).json({ error: true, message: "Invalid credentials" });

      // --| Generate jwt token
      const token = generateToken(existingUser);

      return res.status(apiHttpStatusCodes.STATUS_OK).json({ error: false, message: "User logged in successfully", token });

    } catch (e: any) {
      return res.status(apiHttpStatusCodes.STATUS_INTERNAL_SERVER_ERROR).json({ error: true, message: "Something went wrong, please try again", serverMessage: e.message})
    }
  }
}

export default UserController;