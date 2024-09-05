import {NextFunction, Request, Response} from "express";

const headerConfig = (req: Request, res: Response, next: NextFunction) => {  
 res.header('Access-Control-Allow-Origin', req.headers.origin);
 res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
 next();
};

export default headerConfig;