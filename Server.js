// Load express and its middlwares
const express = require("express");
const bodyParser = require("body-parser");

const router = require("./Router");

exports.start = function startServer(contactService) {
  // Create an instance of express
  const app = express();

  // Configure Middlewares
  app.use(express.static("./public"));
  app.use(bodyParser.json());

  // Add some Routing
  router(app, contactService);

  // Start the server
  app.listen(1234, () => {
    console.log("Server started on http://localhost:1234");
  });
};
