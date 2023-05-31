import express, { Request, Response } from "express";
import dotenv from "dotenv";
import registerInternalUser from "./routes/register-internal-user";
import loginInternalUserRouter from "./routes/login-internal-user";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/register-internal-user", registerInternalUser);
app.use("/login-internal-user", loginInternalUserRouter);

// Start server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
