import {CorsOptions} from "cors";
import "dotenv/config";

export const corsOptions: CorsOptions = {
 origin: process.env.NODE_ENV === "dev" ? "http://localhost:5173" : true,
 credentials: true,
 allowedHeaders: ["authorization","Content-Type"],
 optionsSuccessStatus: 200,
};