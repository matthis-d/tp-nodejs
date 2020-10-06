const fs = require("fs");
const Contact = require("./Contact");

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

module.exports = FileContactService;