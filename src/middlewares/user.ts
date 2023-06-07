import { Router, Request, Response, NextFunction } from "express";
import executeQuery from "../config/db/db-executer";
import { encrypt } from "../utils/helperFunctions";

function validateUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_.-]{3,20}$/;
  return usernameRegex.test(username);
}

export async function updateUser(username: string, lname: string, fname: string, password: string, Id: string, company_id?: string) {
  if (username || lname || fname || password || company_id) {
    const encryptedPassword = password ? await encrypt(password) : ""
    const columnsUpdated = `${username ? `username = '${username}',` : ""} ${fname ? `fname = '${fname}',` : ""} ${lname ? `lname = '${lname}',` : ""} ${password ? `password = '${encryptedPassword}',` : ""} ${company_id ? `company_id = '${company_id}',` : ""}`
    console.log(columnsUpdated);
    const responseResult: any = await executeQuery(
      `UPDATE user
      SET 
      ${columnsUpdated.replace(/,\s*$/, '')}
      WHERE id = '${Id}'`
    );
  }

}

async function isUsernameExists(username: string, table: string): Promise<boolean> {
  const responseResult: any = await executeQuery(
    `SELECT COUNT(*) as count FROM ${table} WHERE username = '${username}'`
  );
  return responseResult[0].count > 0;
}

async function isUserIdExists(id: string, table: string): Promise<boolean> {
  const responseResult: any = await executeQuery(
    `SELECT COUNT(*) as count FROM ${table} WHERE id = '${id}'`
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
    res.status(500).send({ message: "invalid user name" });
  } else {
    next();
  }
}
export async function internalUsernameAvailabilityMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { username } = req.body;
  const isExist = await isUsernameExists(username, "internal_user");
  if (isExist) {
    console.log("Username already exists: " + username);
    res.status(301).send({ message: "Username already exists" });
  } else {
    next();
  }
}
export async function externalUsernameAvailabilityMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { username } = req.body;
  const isExist = await isUsernameExists(username, "user");
  if (isExist) {
    console.log("Username already exists: " + username);
    res.status(301).send({ message: "Username already exists" });
  } else {
    next();
  }
}
export async function internalUsernameExistMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { username } = req.body;
  const isExist = await isUsernameExists(username, "internal_user");
  if (!isExist) {
    console.log("Username already exists: " + username);
    res.status(404).send({ message: "Username is not found" });
  } else {
    next();
  }
}
export async function externalUsernameExistMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { username } = req.body;
  const isExist = await isUsernameExists(username, "user");
  if (!isExist) {
    console.log("Username already exists: " + username);
    res.status(404).send({ message: "Username is not found" });
  } else {
    next();
  }
}

export async function internalUserIdExistMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = req.params.id;
  const isExist = await isUserIdExists(id, "internal_user");
  if (!isExist) {
    return res.status(404).json({ error: 'User not found' });
  } else {
    next();
  }
}
export async function externalUserIdExistMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = req.params.id;
  const isExist = await isUserIdExists(id, "user");
  if (!isExist) {
    return res.status(404).json({ error: 'User not found' });
  } else {
    next();
  }
}
