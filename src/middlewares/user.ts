import { Router, Request, Response, NextFunction } from "express";
import executeQuery from "../config/db/db-executer";

function validateUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_.-]{3,20}$/;
  return usernameRegex.test(username);
}

async function isUsernameAlreadyExists(username: string): Promise<boolean> {
  const responseResult: any = await executeQuery(
    `SELECT COUNT(*) as count FROM internal_user WHERE username = '${username}'`
  );
  return responseResult[0].count > 0;
}

export function usernameFormatMiddleware(
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

export async function usernameAvailabilityMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { username } = req.body;
  const isExist = await isUsernameAlreadyExists(username);
  if (isExist) {
    console.log("Username already exists: " + username);

    res.status(301).send({ message: "Username already exists" });
  } else {
    next();
  }
}
