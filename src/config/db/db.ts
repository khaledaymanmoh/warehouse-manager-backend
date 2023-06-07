import { createConnection } from "mysql";
import dotenv from "dotenv";

dotenv.config();
const db = createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB,
});


export default db;
