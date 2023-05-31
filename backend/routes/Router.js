const express = require("express");
const NodeCache = require("node-cache");
const fs = require("fs");

const router = express.Router();
const cache = new NodeCache();

router.post("/types", (req, res) => {
  const body = JSON.stringify(req.body, null, 2);

  // TODO - replace with actual db file when done testing
  fs.writeFile("editable-data/typesTesting.json", body, (err) => {
    if (err) {
      console.log(`Product type could not be added - ${err}`);

      res.send({
        message: `Product type could not be added - ${err}`,
        types: {},
      });
    } else {
      console.log("Product type was added successfully!");

      res.send({
        message: "Product type successfully added!",
        types: req.body,
      });

      cache.set("types", req.body);
    }
  });
});

// TODO - replace with actual db file when done testing

router.get("/types", (req, res) => {
  if (cache.has("types")) {
    console.log("Fetching cached types.");
    res.send(cache.get("types"));
  } else {
    console.log("Reading types from file system.");

    fs.readFile(
      "editable-data/typesTesting.json",
      "utf8",
      function (err, data) {
        res.send(data);
        cache.set("types", data);
      }
    );
  }
});

// TODO - replace with actual db file when done testing
router.get("/products", (req, res) => {
  if (cache.has("products")) {
    console.log("Fetching cached products.");
    res.send(cache.get("products"));
  } else {
    console.log("Reading products from file system.");

    fs.readFile(
      "editable-data/productsTesting.json",
      "utf8",
      function (err, data) {
        res.send(data);
        cache.set("products", data);
      }
    );
  }
});

// TODO - replace with actual db file when done testing
router.post("/products", (req, res) => {
  const body = JSON.stringify(req.body, null, 2);

  fs.writeFile("editable-data/productsTesting.json", body, (err) => {
    if (err) {
      console.log(`Product could not be added - ${err}`);

      res.send({
        message: `Product could not be added - ${err}`,
        products: {},
      });
    } else {
      console.log("Product was added successfully!");

      res.send({
        message: "Product successfully added!",
        products: req.body,
      });

      cache.set("products", req.body);
    }
  });
});

router.get("/proposals", (req, res) => {
  if (cache.has("proposals")) {
    console.log("Fetching cached proposals.");
    res.send(cache.get("proposals"));
  } else {
    console.log("Reading proposals from file system.");

    fs.readFile(
      "editable-data/proposals.json",
      "utf8",
      function (err, proposalData) {
        res.send(proposalData);
        cache.set("proposals", proposalData);
      }
    );
  }
});

module.exports = router;
