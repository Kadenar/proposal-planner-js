const express = require("express");
const NodeCache = require("node-cache");
const fs = require("fs");

const router = express.Router();
const cache = new NodeCache();

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

router.post("/types", (req, res) => {
  writeFileFunc(
    "data/typesTesting.json",
    req,
    res,
    "Product type could not be added",
    "Product type was added successfully!",
    "types"
  );
});

// TODO - replace with actual db file when done testing
router.get("/types", (req, res) => {
  readFileFunc(
    "data/typesTesting.json",
    res,
    "Fetching cached types.",
    "Reading types from file system.",
    "types"
  );
});

// TODO - replace with actual db file when done testing
router.get("/products", (req, res) => {
  readFileFunc(
    "data/productsTesting.json",
    res,
    "Fetching cached products.",
    "Reading products from file system.",
    "products"
  );
});

// TODO - replace with actual db file when done testing
router.post("/products", (req, res) => {
  writeFileFunc(
    "data/productsTesting.json",
    req,
    res,
    "Product could not be added",
    "Product was added successfully!",
    "products"
  );
});

router.get("/proposals", (req, res) => {
  readFileFunc(
    "data/proposals.json",
    res,
    "Fetching cached proposals.",
    "Reading proposals from file system.",
    "proposals"
  );
});

router.post("/proposals", (req, res) => {
  writeFileFunc(
    "data/proposals.json",
    req,
    res,
    "Proposal could not be added",
    "Proposal was added successfully!",
    "proposals"
  );
});

router.get("/commissions", (req, res) => {
  readFileFunc(
    "data/commissions.json",
    res,
    "Fetching cached commissions.",
    "Reading commissions from file system.",
    "commissions"
  );
});

router.post("/commissions", (req, res) => {
  writeFileFunc(
    "data/commissions.json",
    req,
    res,
    "Commission could not be added",
    "Commission was added successfully!",
    "commissions"
  );
});

router.get("/multipliers", (req, res) => {
  readFileFunc(
    "data/multipliers.json",
    res,
    "Fetching cached multipliers.",
    "Reading multipliers from file system.",
    "multipliers"
  );
});

router.post("/multipliers", (req, res) => {
  writeFileFunc(
    "data/multipliers.json",
    req,
    res,
    "Multiplier could not be added",
    "Multiplier was added successfully!",
    "multipliers"
  );
});

module.exports = router;
