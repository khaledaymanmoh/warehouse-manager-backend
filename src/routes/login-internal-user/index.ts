import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import executeQuery from "../../config/db/db-executer";

const loginInternalUserRouter = Router();

async function validateUserPassword(myPlaintextPassword: string, hash: string) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(myPlaintextPassword, hash, function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

loginInternalUserRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { username: usernameInBody, password: passwordInBody } = req.body;
    const response: any = await executeQuery(
      `SELECT username, password FROM internal_user WHERE username = '${usernameInBody}'`
    );
    if (response.length != 0) {
      const isPasswordCorrect = await validateUserPassword(
        passwordInBody,
        response[0].password
      );
      if (isPasswordCorrect) {
        return res.status(201).send({ message: "User Logged in successfully" });
      }
    }
    res.status(401).send({ message: "Invalid Username or Password" });
  } catch (error) {
    console.log("error", error);
    res.status(500).send("Internal Server Error.");
  }
});

export default loginInternalUserRouter;
