import express from "express";
import path from "path";
import NodeCache from "node-cache";
import fs from "fs";

class Router {
  // ref to Express instance
  public router: express.Router;
  private cache: NodeCache;
  private filePath;

  // Run configuration methods on the Router instance.
  constructor() {
    this.router = express.Router();
    this.cache = new NodeCache();
    this.filePath = path.join(
      __dirname.replace("app.asar\\dist\\", ""),
      "../extraResources"
    );
    this.routes();
  }

  // Configure API endpoints.
  private routes(): void {
    // PREFERENCES \\
    this.router.get("/preferences", (req, res) => {
      this.readFileFunc(
        `${this.filePath}/preferences.json`,
        res,
        "Fetching cached preferences.",
        "Reading preferences from file system.",
        "preferences"
      );
    });

    this.router.post("/preferences", (req, res) => {
      this.writeFileFunc(
        `${this.filePath}/preferences.json`,
        req,
        res,
        "Preferences could not be updated",
        "Preferences update was successful!",
        "preferences"
      );
    });

    // USERS \\
    this.router.get("/users", (req, res) => {
      this.readFileFunc(
        `${this.filePath}/users.json`,
        res,
        "Fetching cached users.",
        "Reading users from file system.",
        "users"
      );
    });

    this.router.post("/users", (req, res) => {
      this.writeFileFunc(
        `${this.filePath}/users.json`,
        req,
        res,
        "Users could not be updated",
        "Users update was successful!",
        "users"
      );
    });

    // FINANCING \\
    this.router.get("/financing", (req, res) => {
      this.readFileFunc(
        `${this.filePath}/financing.json`,
        res,
        "Fetching cached financing.",
        "Reading financing from file system.",
        "financing"
      );
    });

    this.router.post("/financing", (req, res) => {
      this.writeFileFunc(
        `${this.filePath}/financing.json`,
        req,
        res,
        "Financing could not be updated",
        "Financing update was successful!",
        "financing"
      );
    });

    // ADDRESSES \\
    this.router.get("/addresses", (req, res) => {
      this.readFileFunc(
        `${this.filePath}/addressInfo.json`,
        res,
        "Fetching cached addresses.",
        "Reading addresses from file system.",
        "addresses"
      );
    });

    this.router.post("/addresses", (req, res) => {
      this.writeFileFunc(
        `${this.filePath}/addressInfo.json`,
        req,
        res,
        "Addresses could not be updated",
        "Address update was successful!",
        "addresses"
      );
    });

    // CLIENTS \\
    this.router.get("/clients", (req, res) => {
      this.readFileFunc(
        `${this.filePath}/clients.json`,
        res,
        "Fetching cached clients.",
        "Reading clients from file system.",
        "clients"
      );
    });

    this.router.post("/clients", (req, res) => {
      this.writeFileFunc(
        `${this.filePath}/clients.json`,
        req,
        res,
        "Client could not be updated",
        "Client update was successful!",
        "clients"
      );
    });

    // CONTACTS \\
    this.router.get("/contacts", (req, res) => {
      this.readFileFunc(
        `${this.filePath}/contacts.json`,
        res,
        "Fetching cached contacts.",
        "Reading contacts from file system.",
        "contacts"
      );
    });

    this.router.post("/contacts", (req, res) => {
      this.writeFileFunc(
        `${this.filePath}/contacts.json`,
        req,
        res,
        "Contact could not be updated",
        "Contact update was successful!",
        "contacts"
      );
    });

    // PRODUCTS \\
    this.router.get("/products", (req, res) => {
      this.readFileFunc(
        `${this.filePath}/products.json`,
        res,
        "Fetching cached products.",
        "Reading products from file system.",
        "products"
      );
    });

    this.router.post("/products", (req, res) => {
      this.writeFileFunc(
        `${this.filePath}/products.json`,
        req,
        res,
        "Product could not be updated",
        "Product update was successful!",
        "products"
      );
    });

    // PRODUCT TYPES \\
    this.router.get("/types", (req, res) => {
      this.readFileFunc(
        `${this.filePath}/productTypes.json`,
        res,
        "Fetching cached types.",
        "Reading types from file system.",
        "types"
      );
    });

    this.router.post("/types", (req, res) => {
      this.writeFileFunc(
        `${this.filePath}/productTypes.json`,
        req,
        res,
        "Product type could not be updated",
        "Product type update was successful!",
        "types"
      );
    });

    // PROPOSALS \\
    this.router.get("/proposals", (req, res) => {
      this.readFileFunc(
        `${this.filePath}/proposals.json`,
        res,
        "Fetching cached proposals.",
        "Reading proposals from file system.",
        "proposals"
      );
    });

    this.router.post("/proposals", (req, res) => {
      this.writeFileFunc(
        `${this.filePath}/proposals.json`,
        req,
        res,
        "Proposal could not be updated",
        "Proposal update was successful!",
        "proposals"
      );
    });

    // SOLD JOBS \\
    this.router.get("/jobs", (req, res) => {
      this.readFileFunc(
        `${this.filePath}/soldJobs.json`,
        res,
        "Fetching cached sold jobs.",
        "Reading sold jobs from file system.",
        "jobs"
      );
    });

    this.router.post("/jobs", (req, res) => {
      this.writeFileFunc(
        `${this.filePath}/soldJobs.json`,
        req,
        res,
        "Sold jobs could not be updated",
        "Sold jobs update was successful!",
        "jobs"
      );
    });

    // TEMPLATES \\
    this.router.get("/templates", (req, res) => {
      this.readFileFunc(
        `${this.filePath}/templates.json`,
        res,
        "Fetching cached templates.",
        "Reading templates from file system.",
        "templates"
      );
    });

    this.router.post("/templates", (req, res) => {
      this.writeFileFunc(
        `${this.filePath}/templates.json`,
        req,
        res,
        "Template could not be updated",
        "Template update was successful!",
        "templates"
      );
    });

    // LABORS \\
    this.router.get("/labors", (req, res) => {
      this.readFileFunc(
        `${this.filePath}/labors.json`,
        res,
        "Fetching cached labors.",
        "Reading labors from file system.",
        "labors"
      );
    });

    this.router.post("/labors", (req, res) => {
      this.writeFileFunc(
        `${this.filePath}/labors.json`,
        req,
        res,
        "Labor could not be updated",
        "Labor updated was successful!",
        "labors"
      );
    });

    // FEES \\
    this.router.get("/fees", (req, res) => {
      this.readFileFunc(
        `${this.filePath}/fees.json`,
        res,
        "Fetching cached fees.",
        "Reading fees from file system.",
        "fees"
      );
    });

    this.router.post("/fees", (req, res) => {
      this.writeFileFunc(
        `${this.filePath}/fees.json`,
        req,
        res,
        "Fee could not be updated",
        "Fee updated was successful!",
        "fees"
      );
    });

    // PRICING WORKUP \\
    this.router.get("/multipliers", (req, res) => {
      this.readFileFunc(
        `${this.filePath}/multipliers.json`,
        res,
        "Fetching cached multipliers.",
        "Reading multipliers from file system.",
        "multipliers"
      );
    });

    this.router.post("/multipliers", (req, res) => {
      this.writeFileFunc(
        `${this.filePath}/multipliers.json`,
        req,
        res,
        "Multipliers could not be updated",
        "Multipliers updated was successful!",
        "multipliers"
      );
    });
  }

  private readFileFunc(
    path: string,
    res: any,
    cacheMsg: string,
    dbMsg: string,
    cacheKey: string
  ): void {
    if (this.cache.has(cacheKey)) {
      console.log(cacheMsg);
      res.send(this.cache.get(cacheKey));
    } else {
      console.log(dbMsg);
      const cacheVal = this.cache;
      fs.readFile(path, "utf8", function (err, data) {
        res.send(data);
        cacheVal.set(cacheKey, data);
      });
    }
  }

  private writeFileFunc(
    path: string,
    req: any,
    res: any,
    errMsg: string,
    successMsg: string,
    cacheKey: string
  ): void {
    const body = JSON.stringify(req.body, null, 2);
    fs.writeFile(path, body, (err) => {
      if (err) {
        console.log(`${errMsg} - ${err}`);

        res.send({
          message: `${errMsg} - ${err}`,
          [cacheKey]: {},
        });
      } else {
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

export default new Router().router;
