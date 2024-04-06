import jwt from "jsonwebtoken";
import env from "@config/config";
import { IUser } from "@models/users.model";

export const generateToken = (user: IUser): string => {
  const token = jwt.sign({ id: user.id, email: user.email }, env.jwt_secret, { expiresIn: "15m" });
  return token;
}

export const decodeToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, env.jwt_secret)
    return decoded as Pick<IUser, "id" | "email">;
  } catch (error: any) {
    throw new Error(error)
  }
}