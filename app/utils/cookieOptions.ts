import {CookieOptions} from "express";
import "dotenv/config";

export const cookieOptions: CookieOptions = {
 maxAge: 1000 * 60 * 60 * 24 * 30,
 secure: process.env.NODE_ENV === "prod",
 httpOnly: true,
 sameSite: process.env.NODE_ENV === "dev" ? 'lax' : 'none',
};