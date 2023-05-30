import express, { Request, Response } from "express";
import dotenv from "dotenv";
import registerInternalUser from "./routes/register-internal-user";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/register-internal-user", registerInternalUser);

// Start server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
