import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import Router from "./Router";
import path from "path";

// Creates and configures an ExpressJS web server.
class Server {
  // ref to Express instance
  public express: express.Application;

  // Run configuration methods on the Express instance.
  constructor() {
    this.express = express();
    this.middleware();
    this.express.use("/", Router);
    this.express.get("/", (req, res) => res.json({ ping: true }));
  }

  // Configure Express middleware.
  private middleware(): void {
    const corsOptions = {
      origin: "*",
      credentials: true,
      optionSuccessStatus: 200,
    };

    this.express.use(cors(corsOptions));
    // this.express.use( // TODO -> Maybe to have products in the future?
    //   "/images",
    //   express.static(path.join(__dirname, "public/images"))
    // );

    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }
}

export default new Server().express;
