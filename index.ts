import express, {type Application} from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import {expressMiddleware} from "@apollo/server/express4";
import apolloServer from "./app/schema/server";
import {json} from "body-parser";
import cookieParser from "cookie-parser";
import isAuth from "./app/middlewares/isAuth";
import path from "path";
import errorHandler from "./app/middlewares/errorHandler";
import compression from "compression";
import headerConfig from "./app/middlewares/headerConfig";
import "dotenv/config";
import {API} from "./app/routes/API";
import {corsOptions} from "./app/utils/corsOptions";
import {createServer} from "http";
import {Server} from "socket.io";
import chatIO from "./app/sockets/chatIO";

const app: Application = express();

app.use(express.json());
app.use(cors(corsOptions));
app.use(headerConfig);
app.use(helmet());
app.use(morgan("tiny"));
app.use(cookieParser());
app.use(compression());
app.disable("x-powered-by");
app.set('trust proxy', 1);

app.use("/images",express.static(path.join(process.cwd(),"/app/images")));
app.use("/api",API);

const init = async () => {
 try {
  await apolloServer.start();
  app.use(
   "/graphql",
   cors<cors.CorsRequest>({
    origin: ["http://localhost:3000","https://social-media-client-148u.onrender.com"],
    credentials: true,
   }),
   json(),
   isAuth,
   expressMiddleware(apolloServer, {
    context: async ({req,res}) => ({user: res.locals.user}),
   })
  );

  app.all("*",(_, res) => res.status(404).json({message: "Invalid API Route"}));
  app.use(errorHandler);

  const server = createServer(app);
  const io = new Server(server);

  chatIO(io);

  const host = server.listen(9000, () => console.log("Server Listening"));
  process.on("SIGTERM", () => host.close(() => console.log("Server Closed")));
 } catch(error) {
  console.log("Graphql error", error);
 };
};

init();