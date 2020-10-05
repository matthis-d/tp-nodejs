const data = require("./contacts.json");

class Contact {
  constructor(id, firstName, lastName, address, phone) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.address = address;
    this.phone = phone;
  }

  toString() {
    return `${this.lastName.toUpperCase()} ${this.firstName}`;
  }
}

class ContactService {
  constructor() {
    this.contacts = data.map((elem) => {
      const contact = new Contact(
        elem.id,
        elem.firstName,
        elem.lastName,
        elem.address,
        elem.phone
      );
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
contactService.print();
