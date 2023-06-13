import { Router, Request, Response, NextFunction } from "express";
import externalRouter from "./external";
import internalRouter from "./internal";

const userRouter = Router();

userRouter.use("/internal", internalRouter);
userRouter.use("/", externalRouter);

export default userRouter;
