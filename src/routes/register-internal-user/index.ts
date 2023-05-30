import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import db from "../../config/db";

const registerInternalUserRouter = Router();

registerInternalUserRouter.post(
  "/",
  usernameFormatMiddleware,
  (req: Request, res: Response) => {
    const { fname, lname, username, password, type_id } = req.body;
    res.send("Hello, User!");
  }
);

function encrypt(password: string, rounds: number = 10) {
  bcrypt.hash(password, rounds, (err, hash) => {
    if (err) {
      console.log(err);
    } else {
      return hash;
    }
  });
}

function validateUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return usernameRegex.test(username);
}

function usernameFormatMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { username } = req.body;
  if (!validateUsername(username)) {
    res.status(500).send({ message: "555 eh da" });
  } else {
    next();
  }
}

function usernameAvailabilityMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { username } = req.body;
  if (!validateUsername(username)) {
    res.status(500).send({ message: "555 eh da" });
  } else {
    next();
  }
}

function isUsernameAlreadyExists(username: string): boolean {
  db.query(
    `SELECT COUNT(*) FROM internal_user WHERE username = '${username}'`,
    (err, res) => {
      // console.log(err);
      console.log(res);
    }
  );
  // console.log(db);
  return true;
}

isUsernameAlreadyExists("j.Doe");
export default registerInternalUserRouter;
