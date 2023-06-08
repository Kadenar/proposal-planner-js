"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const Router_1 = __importDefault(require("./Router"));
// Creates and configures an ExpressJS web server.
class Server {
    // Run configuration methods on the Express instance.
    constructor() {
        this.express = (0, express_1.default)();
        this.middleware();
        this.express.use("/", Router_1.default);
        this.express.get("/", (req, res) => res.json({ ping: true }));
    }
    // Configure Express middleware.
    middleware() {
        const corsOptions = {
            origin: "*",
            credentials: true,
            optionSuccessStatus: 200,
        };
        this.express.use((0, cors_1.default)(corsOptions));
        // this.express.use( // TODO -> Maybe to have products in the future?
        //   "/images",
        //   express.static(path.join(__dirname, "public/images"))
        // );
        this.express.use(body_parser_1.default.json());
        this.express.use(body_parser_1.default.urlencoded({ extended: false }));
    }
}
exports.default = new Server().express;
