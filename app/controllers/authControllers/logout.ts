import type {Request, Response} from "express";

const logout = async (_: Request, res: Response) => {
 return res.status(200).clearCookie("socialuser").json({success: true});
};

export default logout;