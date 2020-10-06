const http = require("http");
// Load express and its middlwares
const express = require("express");
const bodyParser = require("body-parser");
const socketIO = require("socket.io");

const router = require("./Router");

exports.start = function startServer(contactService) {
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
};
