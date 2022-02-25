import {Request, Response, ErrorRequestHandler, NextFunction} from "express";
// @ts-ignore
export const asyncHandler = fn => (req:Request, res:Response, next:NextFunction) =>
    Promise.resolve()
        .then(() => fn(req, res, next))
        .catch(next);
