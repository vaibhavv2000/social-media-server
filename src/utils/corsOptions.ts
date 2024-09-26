import {CorsOptions} from "cors";
import "dotenv/config";

export const corsOptions: CorsOptions = {
 origin: process.env.NODE_ENV === "dev" ? "http://localhost:5173" : true,
 credentials: true,
 allowedHeaders: ["authorization","Content-Type"],
 optionsSuccessStatus: 200,
};

export const graphQLCorsOptions: CorsOptions = {
 origin: process.env.NODE_ENV === "dev" ? "http://localhost:5173" : 
 [ 
  "https://social-media-client-148u.onrender.com",
  "https://socio-three-mu.vercel.app",
 ],
 credentials: true,
 allowedHeaders: ["authorization","Content-Type"],
 optionsSuccessStatus: 200,
};