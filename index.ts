import express,{Application,NextFunction,Request,Response} from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import {expressMiddleware} from "@apollo/server/express4";
import apolloServer from "./app/schema/server";
import {json} from "body-parser";
import cookieParser from "cookie-parser";
import {API} from "./app/API/API";
import isAuth from "./app/API/isAuth";
import path from "path";

const app: Application = express();

app.use(express.json());

app.use(helmet({
 crossOriginResourcePolicy: false,
}));
app.use(cors({
 origin: "*",
 credentials: true,
}));
app.use(morgan("tiny"));
app.use(cookieParser());

app.use("/images",express.static(path.join(process.cwd(),"/app/images")));
app.use("/api",API);

const init = async () => {
 try {
  await apolloServer.start();
  app.use(
   "/graphql",
   cors<cors.CorsRequest>({
    origin: "*",
    credentials: true,
   }),
   json(),
   isAuth,
   expressMiddleware(apolloServer,{
    context: async ({req,res}) => ({user: res.locals.user}),
   })
  );

  // app.all("*",(_: Request,res: Response) => {
  //  return res.status(404).json({message: "Not found"});
  // });

  // error Handler
  app.use((err: Error,req: Request,res: Response,next: NextFunction) => {
   return res.status(500).json({message: err.message});
  });

  app.listen(9000,() => console.log(`Server running on localhost:9000`));
 } catch(error) {
  if(error instanceof Error) console.log("Graphql error",error.message);
 }
}

init();