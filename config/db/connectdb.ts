import knex from "knex";
import config from "./knexfile";
import env from "../config";
export default knex(config[env.environment]);
