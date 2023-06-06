import { Router, Request, Response, NextFunction } from "express";
import { usernameAvailabilityMiddleware, usernameFormatMiddleware } from "../../../middlewares/user";
import { encrypt } from "../../../utils/helperFunctions";

import bcrypt from "bcrypt";
import executeQuery from "../../../config/db/db-executer";
import { validateUserPassword } from "../../../utils/userUtils";

const internalRouter = Router();

internalRouter.post("/login", async (req: Request, res: Response) => {
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


internalRouter.post(
  "/register",
  usernameFormatMiddleware,
  usernameAvailabilityMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { fname, lname, username, password, type_id } = req.body;
      const hashedPassword = await encrypt(password);
      const queryResponse = await executeQuery(
        `INSERT INTO internal_user (fname, lname, username, password, type_id) VALUES ('${fname}', '${lname}', '${username}', '${hashedPassword}', ${type_id})`
      );
      console.log("Added a new user: ", queryResponse);
      res.status(201).send({ message: "User added successfully" });
    } catch (error) {
      console.log("error", error);
      res.status(500).send("Internal Server Error.");
    }
  }
);

export default internalRouter;

