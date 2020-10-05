const chalk = require("chalk");
const yargs = require("yargs");

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

module.exports = Contact;
