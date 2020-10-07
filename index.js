// const FileContactService = require("./FileContactService");
const MongoContactService = require("./MongoContactService");
const Cli = require("./Cli");

// const contactService = new FileContactService();
const mongoContactService = new MongoContactService();
Cli.run(mongoContactService);
