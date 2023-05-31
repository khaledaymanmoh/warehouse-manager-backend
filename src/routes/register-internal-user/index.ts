import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import executeQuery from "../../config/db/db-executer";

import {
  usernameFormatMiddleware,
  usernameAvailabilityMiddleware,
} from "../../middlewares/user";

const registerInternalUserRouter = Router();

registerInternalUserRouter.post(
  "/",
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

function encrypt(password: string, rounds: number = 10) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, rounds, (err, hash) => {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });
}

export default registerInternalUserRouter;
