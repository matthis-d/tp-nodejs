const http = require("http");
const cluster = require("cluster");
const yargs = require("yargs");
// Load express and its middlwares
const express = require("express");
const bodyParser = require("body-parser");
const socketIO = require("socket.io");

const router = require("./Router");

function startServer(contactService) {
  if (cluster.isWorker) {
    console.log(`Starting server from worker ${cluster.worker.id}`);
  }

  // Create an instance of express
  const app = express();
  const server = http.Server(app);
  const io = socketIO.listen(server);

  // Configure Middlewares
  app.use(express.static("./public"));
  app.use(bodyParser.json());

  // Add some Routing
  router(app, contactService, io);

  // Start the server
  server.listen(1234, () => {
    console.log("Server started on http://localhost:1234");
  });
}

exports.start = function start(contactService) {
  const { cluster: nbCluster } = yargs.argv;

  if (!nbCluster) {
    return startServer(contactService);
  }

  if (cluster.isMaster) {
    for (let i = 0; i < nbCluster; i++) {
      cluster.fork();
    }
  } else {
    startServer(contactService);
  }
};
