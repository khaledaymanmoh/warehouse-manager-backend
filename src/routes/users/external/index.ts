
import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import executeQuery from "../../../config/db/db-executer";
import { externalUsernameAvailabilityMiddleware, externalUsernameExistMiddleware, internalUsernameExistMiddleware, usernameFormatMiddleware } from "../../../middlewares/user";
import { encrypt } from "../../../utils/helperFunctions";

const externalRouter = Router();


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

externalRouter.post("/login", async (req: Request, res: Response) => {
    try {
        const { username: usernameInBody, password: passwordInBody } = req.body;
        const response: any = await executeQuery(
            `SELECT username, password FROM user WHERE username = '${usernameInBody}'`
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

externalRouter.post(
    "/register",
    usernameFormatMiddleware,
    externalUsernameAvailabilityMiddleware,
    async (req: Request, res: Response) => {
        try {
            const { fname, lname, username, password, type_id, company_id } = req.body;
            const hashedPassword = await encrypt(password);
            const queryResponse = await executeQuery(
                `INSERT INTO user (fname, lname, username, password, type_id, company_id) VALUES ('${fname}', '${lname}', '${username}', '${hashedPassword}', ${type_id}, ${company_id})`
            );
            res.status(201).send({ message: "User added successfully" });
        } catch (error) {
            console.log("error", error);
            res.status(500).send("Internal Server Error.");
        }
    }
);

externalRouter.delete("/delete", externalUsernameExistMiddleware, async (req: Request, res: Response) => {
    //TODO: Add security Layer to accept user deletion
    try {
        const { username } = req.body;
        const queryResponse = await executeQuery(
            `DELETE FROM user WHERE username ='${username}'`
        );
        res.status(201).send({ message: "User deleted successfully" });
    } catch (error) {
        console.log("error", error);
        res.status(500).send("Internal Server Error.");
    }
})




export default externalRouter;