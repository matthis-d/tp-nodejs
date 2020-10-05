const Contact = require("./Contact");
const data = require("./contacts.json");

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

module.exports = ContactService;
