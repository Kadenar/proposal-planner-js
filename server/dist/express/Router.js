"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const node_cache_1 = __importDefault(require("node-cache"));
const fs_1 = __importDefault(require("fs"));
class Router {
    // Run configuration methods on the Router instance.
    constructor() {
        this.router = express_1.default.Router();
        this.cache = new node_cache_1.default();
        this.filePath = path_1.default.join(__dirname, "/data/testing");
        this.routes();
    }
    // Configure API endpoints.
    routes() {
        // CLIENTS \\
        this.router.get("/clients", (req, res) => {
            console.log(`${this.filePath}`);
            this.readFileFunc(`${this.filePath}/clients.json`, res, "Fetching cached clients.", "Reading clients from file system.", "clients");
        });
        this.router.post("/clients", (req, res) => {
            this.writeFileFunc(`${this.filePath}/clients.json`, req, res, "Client could not be updated", "Client update was successful!", "clients");
        });
        // PRODUCTS \\
        this.router.get("/products", (req, res) => {
            this.readFileFunc(`${this.filePath}/products.json`, res, "Fetching cached products.", "Reading products from file system.", "products");
        });
        this.router.post("/products", (req, res) => {
            this.writeFileFunc(`${this.filePath}/products.json`, req, res, "Product could not be updated", "Product update was successful!", "products");
        });
        // PRODUCT TYPES \\
        this.router.get("/types", (req, res) => {
            this.readFileFunc(`${this.filePath}/productTypes.json`, res, "Fetching cached types.", "Reading types from file system.", "types");
        });
        this.router.post("/types", (req, res) => {
            this.writeFileFunc(`${this.filePath}/productTypes.json`, req, res, "Product type could not be updated", "Product type update was successful!", "types");
        });
        // PROPOSALS \\
        this.router.get("/proposals", (req, res) => {
            this.readFileFunc(`${this.filePath}/proposals.json`, res, "Fetching cached proposals.", "Reading proposals from file system.", "proposals");
        });
        this.router.post("/proposals", (req, res) => {
            this.writeFileFunc(`${this.filePath}/proposals.json`, req, res, "Proposal could not be updated", "Proposal update was successful!", "proposals");
        });
        // COMMISSIONS \\
        this.router.get("/commissions", (req, res) => {
            this.readFileFunc(`${this.filePath}/commissions.json`, res, "Fetching cached commissions.", "Reading commissions from file system.", "commissions");
        });
        this.router.post("/commissions", (req, res) => {
            this.writeFileFunc(`${this.filePath}/commissions.json`, req, res, "Commission could not be updated", "Commission update was successful!", "commissions");
        });
        // MULTIPLIERS \\
        this.router.get("/multipliers", (req, res) => {
            this.readFileFunc(`${this.filePath}/multipliers.json`, res, "Fetching cached multipliers.", "Reading multipliers from file system.", "multipliers");
        });
        this.router.post("/multipliers", (req, res) => {
            this.writeFileFunc(`${this.filePath}/multipliers.json`, req, res, "Multiplier could not be updated", "Multiplier updated was successful!", "multipliers");
        });
        // LABORS \\
        this.router.get("/labors", (req, res) => {
            this.readFileFunc(`${this.filePath}/labors.json`, res, "Fetching cached labors.", "Reading labors from file system.", "labors");
        });
        this.router.post("/labors", (req, res) => {
            this.writeFileFunc(`${this.filePath}/labors.json`, req, res, "Labor could not be updated", "Labor updated was successful!", "labors");
        });
        // FEES \\
        this.router.get("/fees", (req, res) => {
            this.readFileFunc(`${this.filePath}/fees.json`, res, "Fetching cached fees.", "Reading fees from file system.", "fees");
        });
        this.router.post("/fees", (req, res) => {
            this.writeFileFunc(`${this.filePath}/fees.json`, req, res, "Fee could not be updated", "Fee updated was successful!", "fees");
        });
    }
    readFileFunc(path, res, cacheMsg, dbMsg, cacheKey) {
        if (this.cache.has(cacheKey)) {
            console.log(cacheMsg);
            res.send(this.cache.get(cacheKey));
        }
        else {
            console.log(dbMsg);
            const cacheVal = this.cache;
            fs_1.default.readFile(path, "utf8", function (err, data) {
                res.send(data);
                cacheVal.set(cacheKey, data);
            });
        }
    }
    writeFileFunc(path, req, res, errMsg, successMsg, cacheKey) {
        const body = JSON.stringify(req.body, null, 2);
        fs_1.default.writeFile(path, body, (err) => {
            if (err) {
                console.log(`${errMsg} - ${err}`);
                res.send({
                    message: `${errMsg} - ${err}`,
                    [cacheKey]: {},
                });
            }
            else {
                console.log(successMsg);
                res.send({
                    message: successMsg,
                    [cacheKey]: req.body,
                });
                this.cache.set(cacheKey, req.body);
            }
        });
    }
}
exports.default = new Router().router;
