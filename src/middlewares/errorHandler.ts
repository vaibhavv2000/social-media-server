import type {NextFunction, Request, Response} from "express";

const errorHandler = (error: Error, _: Request, res: Response, next: NextFunction) => {
 return res.status(500).json(error);
};

export default errorHandler;