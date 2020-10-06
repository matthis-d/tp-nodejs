const fs = require("fs");
const Contact = require("./Contact");
const ReadImplems = require("./ReadImplems");
const { writePromises } = require("./WriteImplem");

class FileContactService {
  constructor() {
    this.path = "./contacts.json";
  }

  read(callback) {
    ReadImplems.stream(this.path, callback);
  }

  get(callback) {
    ReadImplems.stream(this.path, callback);
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
    writePromises(contacts, callback);
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

  update(id, data, callback) {
    this.read((err, existingContacts) => {
      if (err) {
        return callback(err);
      }

      const updatedContacts = existingContacts.map((contact) => {
        if (contact.id === id) {
          return { ...contact, ...data };
        }
        return contact;
      });

      this.write(updatedContacts, callback);
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

  watch(callback) {
    fs.watch(this.path, () => {
      this.get((err, data) => {
        if (!err) {
          callback(null, data);
        }
      });
    });
  }
}

module.exports = FileContactService;
