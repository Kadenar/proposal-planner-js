const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const router = require("./routes/Router");

const proposalPlanner = express();

proposalPlanner.use(bodyParser.json());
proposalPlanner.use(bodyParser.urlencoded({ extended: false }));

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

proposalPlanner.use(cors(corsOptions));
proposalPlanner.use("/", router);

proposalPlanner.get("/", (req, res) => res.json({ ping: true }));

const port = 4000;
const server = proposalPlanner.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// setInterval(
//   () =>
//     server.getConnections((err, connections) =>
//       console.log(`${connections} connections currently open`)
//     ),
//   10000
// );

process.on("SIGTERM", shutDown);
process.on("SIGINT", shutDown);

let connections = [];

server.on("connection", (connection) => {
  connections.push(connection);
  connection.on(
    "close",
    () => (connections = connections.filter((curr) => curr !== connection))
  );
});

function shutDown() {
  console.log("Received kill signal, shutting down gracefully");
  server.close(() => {
    console.log("Closed out remaining connections");
    process.exit(0);
  });

  setTimeout(() => {
    console.error(
      "Could not close connections in time, forcefully shutting down"
    );
    process.exit(1);
  }, 10000);

  connections.forEach((curr) => curr.end());
  setTimeout(() => connections.forEach((curr) => curr.destroy()), 5000);
}

module.exports = server;
