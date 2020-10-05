const chalk = require("chalk");
const { boolean } = require("yargs");
const yargs = require("yargs");

const data = require("./contacts.json");

class Contact {
  constructor({ id, firstName, lastName, phone, address }) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.address = address;
    this.phone = phone;
  }

  toString() {
    const { color } = yargs.argv;

    if (color) {
      return `${chalk.blue(this.lastName.toUpperCase())} ${chalk.red(
        this.firstName
      )}`;
    }

    return `${this.lastName.toUpperCase()} ${this.firstName}`;
  }
}

class ContactService {
  constructor() {
    this.contacts = data.map((elem) => {
      const contact = new Contact(elem);
      return contact;
    });
  }

  get() {
    return this.contacts;
  }

  print() {
    this.get().forEach((contact) => {
      console.log(contact.toString());
    });
  }
}

const contactService = new ContactService();

yargs
  .scriptName("contacts.js")
  .usage("$0 <cmd> [args]")
  .command(
    "list",
    "List all contacts",
    (args) => {
      args.option("color", {
        alias: "c",
        type: "boolean",
        default: false,
        describe: "Print list in colors",
      });
    },
    () => {
      contactService.print();
    }
  )
  .help().argv;
