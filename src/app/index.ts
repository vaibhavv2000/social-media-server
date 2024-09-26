import express, {type Application} from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import {expressMiddleware} from "@apollo/server/express4";
import {json} from "body-parser";
import cookieParser from "cookie-parser";
import path from "path";
import compression from "compression";
import "dotenv/config";
import {createServer} from "http";
import {Server} from "socket.io";
import {corsOptions, graphQLCorsOptions} from "../utils/corsOptions";
import headerConfig from "../middlewares/headerConfig";
import {API} from "../routes/API";
import apolloServer from "../schema/server";
import errorHandler from "../middlewares/errorHandler";
import isAuth from "../middlewares/isAuth";
import chatIO from "../sockets/chatIO";

const app: Application = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors(corsOptions));
app.use(headerConfig);
app.use(helmet());
app.use(morgan("tiny"));
app.use(cookieParser());
app.use(compression());
app.disable("x-powered-by");
app.set('trust proxy', 1);

app.use("/images",express.static(path.join(process.cwd(),"/src/images")));
app.use("/api",API);

const init = async () => {
 try {
  await apolloServer.start();
  app.use(
   "/graphql",
   cors(graphQLCorsOptions),
   json(),
   isAuth,
   expressMiddleware(apolloServer, {
    context: async ({req,res}) => ({user: res.locals.user}),
   }),
  );

  app.all("*",(_, res) => res.status(404).json({message: "Invalid API Route"}));
  app.use(errorHandler);

  const server = createServer(app);
  const io = new Server(server);

  chatIO(io);

  const host = server.listen(PORT, () => console.log(`> running on ${PORT}`));
  process.on("SIGTERM", () => host.close(() => console.log("Server Closed")));
 } catch(error) {
  throw new Error(`Graphql error: ${JSON.stringify(error)}`);
 };
};

init();