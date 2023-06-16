const express = require("express");
const NodeCache = require("node-cache");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const cache = new NodeCache();

// The starting file path for fetching json files from
const filePath = path.join(
  __dirname.replace("app.asar\\dist\\", ""),
  "../extraResources"
);

// ADDRESSES \\
router.get("/addresses", (req, res) => {
  readFileFunc(
    `${filePath}/addressInfo.json`,
    res,
    "Fetching cached addresses.",
    "Reading addresses from file system.",
    "addresses"
  );
});

router.post("/addresses", (req, res) => {
  writeFileFunc(
    `${filePath}/addressInfo.json`,
    req,
    res,
    "Addresses could not be updated",
    "Address update was successful!",
    "addresses"
  );
});

// CLIENTS \\
router.get("/clients", (req, res) => {
  readFileFunc(
    `${filePath}/clients.json`,
    res,
    "Fetching cached clients.",
    "Reading clients from file system.",
    "clients"
  );
});

router.post("/clients", (req, res) => {
  writeFileFunc(
    `${filePath}/clients.json`,
    req,
    res,
    "Client could not be updated",
    "Client update was successful!",
    "clients"
  );
});

// CONTACTS \\
router.get("/contacts", (req, res) => {
  readFileFunc(
    `${filePath}/contacts.json`,
    res,
    "Fetching cached contacts.",
    "Reading contacts from file system.",
    "contacts"
  );
});

router.post("/contacts", (req, res) => {
  writeFileFunc(
    `${filePath}/contacts.json`,
    req,
    res,
    "Contact could not be updated",
    "Contact update was successful!",
    "contacts"
  );
});

// PRODUCTS \\
router.get("/products", (req, res) => {
  readFileFunc(
    `${filePath}/products.json`,
    res,
    "Fetching cached products.",
    "Reading products from file system.",
    "products"
  );
});

router.post("/products", (req, res) => {
  writeFileFunc(
    `${filePath}/products.json`,
    req,
    res,
    "Product could not be updated",
    "Product update was successful!",
    "products"
  );
});

// PRODUCT TYPES \\
router.get("/types", (req, res) => {
  readFileFunc(
    `${filePath}/productTypes.json`,
    res,
    "Fetching cached types.",
    "Reading types from file system.",
    "types"
  );
});

router.post("/types", (req, res) => {
  writeFileFunc(
    `${filePath}/productTypes.json`,
    req,
    res,
    "Product type could not be updated",
    "Product type update was successful!",
    "types"
  );
});

// PROPOSALS \\
router.get("/proposals", (req, res) => {
  readFileFunc(
    `${filePath}/proposals.json`,
    res,
    "Fetching cached proposals.",
    "Reading proposals from file system.",
    "proposals"
  );
});

router.post("/proposals", (req, res) => {
  writeFileFunc(
    `${filePath}/proposals.json`,
    req,
    res,
    "Proposal could not be updated",
    "Proposal update was successful!",
    "proposals"
  );
});

// COMMISSIONS \\
router.get("/commissions", (req, res) => {
  readFileFunc(
    `${filePath}/commissions.json`,
    res,
    "Fetching cached commissions.",
    "Reading commissions from file system.",
    "commissions"
  );
});

router.post("/commissions", (req, res) => {
  writeFileFunc(
    `${filePath}/commissions.json`,
    req,
    res,
    "Commission could not be updated",
    "Commission update was successful!",
    "commissions"
  );
});

// MULTIPLIERS \\
router.get("/multipliers", (req, res) => {
  readFileFunc(
    `${filePath}/multipliers.json`,
    res,
    "Fetching cached multipliers.",
    "Reading multipliers from file system.",
    "multipliers"
  );
});

router.post("/multipliers", (req, res) => {
  writeFileFunc(
    `${filePath}/multipliers.json`,
    req,
    res,
    "Multiplier could not be updated",
    "Multiplier updated was successful!",
    "multipliers"
  );
});

// LABORS \\
router.get("/labors", (req, res) => {
  readFileFunc(
    `${filePath}/labors.json`,
    res,
    "Fetching cached labors.",
    "Reading labors from file system.",
    "labors"
  );
});

router.post("/labors", (req, res) => {
  writeFileFunc(
    `${filePath}/labors.json`,
    req,
    res,
    "Labor could not be updated",
    "Labor updated was successful!",
    "labors"
  );
});

// FEES \\
router.get("/fees", (req, res) => {
  readFileFunc(
    `${filePath}/fees.json`,
    res,
    "Fetching cached fees.",
    "Reading fees from file system.",
    "fees"
  );
});

router.post("/fees", (req, res) => {
  writeFileFunc(
    `${filePath}/fees.json`,
    req,
    res,
    "Fee could not be updated",
    "Fee updated was successful!",
    "fees"
  );
});

const writeFileFunc = (path, req, res, errMsg, successMsg, cacheKey) => {
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

      cache.set(cacheKey, req.body);
    }
  });
};

const readFileFunc = (path, res, cacheMsg, dbMsg, cacheKey) => {
  if (cache.has(cacheKey)) {
    console.log(cacheMsg);
    res.send(cache.get(cacheKey));
  } else {
    console.log(dbMsg);

    fs.readFile(path, "utf8", function (err, data) {
      res.send(data);
      cache.set(cacheKey, data);
    });
  }
};

module.exports = router;
