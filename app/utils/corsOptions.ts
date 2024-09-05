import {CorsOptions} from "cors";
import "dotenv/config";

export const corsOptions: CorsOptions = {
 origin: process.env.NODE_ENV === "dev" ? "http://localhost:3000" : true,
 credentials: true,
 allowedHeaders: ["authorization","Content-Type"],
 optionsSuccessStatus: 200,
};