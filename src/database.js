import pkg from "pkg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

const connection = new Pool({
  connectionString: process.env.DATABASE_URL,
});
