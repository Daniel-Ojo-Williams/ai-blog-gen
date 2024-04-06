import { Knex } from "knex";

export interface IUser {
  id: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  created_at?: Date;
  updated_at?: Date;
}

class User {
  private readonly db: Knex;

  constructor(db: Knex) {
    this.db = db;
  }

  async create(user: IUser){
    await this.db("users").insert(user)
  }

  async findById(id: string): Promise<IUser | undefined> {
    const user = await this.db("users").where('id', id).first();
    return user as IUser | undefined;
  }

  async findUserByEmail(email: string): Promise<IUser | undefined> {
    const user = await this.db("users").where('email', email).first();
    return user as IUser | undefined;
  }

  async updateUser(id: string, user: Partial<IUser>): Promise<IUser | undefined>{
    const [updatedUser] = await this.db("users").where('id', id).update(user).returning("*");
    return updatedUser as IUser | undefined;
  }

  async deleteUser(id: string): Promise<void> {
    await this.db("users").where('id', id).delete();
  }
}

export default User;