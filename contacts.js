const fs = require("fs");
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

class FileContactService {
  constructor() {
    this.path = "./contacts.json";
  }

  read(callback) {
    fs.readFile(this.path, (err, data) => {
      if (err) {
        return callback(err);
      }

      callback(null, JSON.parse(data));
    });
  }

  get(callback) {
    this.read((err, data) => {
      if (err) {
        return callback(err);
      }

      const contacts = data.map((ctc) => new Contact(ctc));
      callback(null, contacts);
    });
  }

  print() {
    this.get((err, contacts) => {
      if (err) {
        console.error("Something bad happened");
        console.error(err);
        return;
      }

      contacts.forEach((contact) => {
        console.log(contact.toString());
      });
    });
  }

  write(contacts, callback) {
    fs.writeFile(this.path, JSON.stringify(contacts), (err) => {
      callback(err);
    });
  }

  add(firstName, lastName, callback) {
    this.read((err, existingContacts) => {
      if (err) {
        return callback(err);
      }

      const existingIds = existingContacts.map((ctc) => ctc.id);
      const newId = Math.max(...existingIds) + 1;

      const addedContact = new Contact({ id: newId, firstName, lastName });

      const contacts = [...existingContacts, addedContact];

      this.write(contacts, callback);
    });
  }

  delete(id, callback) {
    this.read((err, contacts) => {
      if (err) {
        return callback(err);
      }

      const updatedContacts = contacts.filter((contact) => contact.id !== id);

      this.write(updatedContacts, callback);
    });
  }
}

const contactService = new FileContactService();

yargs
  .scriptName("contacts.js")
  .usage("$0 <cmd> [args]")
  .option("color", {
    alias: "c",
    type: "boolean",
    default: false,
    describe: "Print list in colors",
  })
  .command(
    "list",
    "List all contacts",
    () => {},
    () => {
      contactService.print();
    }
  )
  .command(
    "add",
    "Add a contact",
    (args) => {
      args
        .positional("firstName", {
          type: "string",
          required: true,
          describe: "Contact's firstName",
        })
        .positional("lastName", {
          type: "string",
          required: true,
          describe: "Contact's lastName",
        });
    },
    (argv) => {
      contactService.add(argv.firstName, argv.lastName, () => {
        contactService.print();
      });
    }
  )
  .command(
    "delete",
    "Delete a contact",
    (args) => {
      args.positional("id", {
        type: "nummber",
        required: true,
        describe: "The id of the contact to delete",
      });
    },
    (argv) => {
      contactService.delete(argv.id, (err) => {
        if (err) {
          console.error(err);
        } else {
          contactService.print();
        }
      });
    }
  )
  .help().argv;
