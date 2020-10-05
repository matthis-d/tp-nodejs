const FileContactService = require("./FileContactService");
const Cli = require("./Cli");

const contactService = new FileContactService();
Cli.run(contactService);
