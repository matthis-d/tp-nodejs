const mongoose = require("mongoose");
const Contact = require("./Contact");

const contactSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  firstName: String,
  lastName: String,
  address: String,
  phone: String,
});

const ContactModel = mongoose.model("Contact", contactSchema);

class MongoContactService {
  constructor() {
    mongoose.connect("mongodb://localhost/test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  async get(callback) {
    try {
      const elements = await ContactModel.find({}).exec();

      const contacts = elements.map((elem) => new Contact(elem));
      return callback(null, contacts);
    } catch (err) {
      return callback(err);
    }
  }

  async add(firstName, lastName, callback) {
    try {
      const maxContact = await ContactModel.findOne().sort("-id").exec();
      console.log(maxContact);
      const maxId = maxContact ? maxContact.id : 0;
      const newId = maxId + 1;

      const contact = new ContactModel({
        id: newId,
        firstName,
        lastName,
      });

      await contact.save();
      callback(null);
    } catch (err) {
      callback(err);
    }
  }

  async update(id, { firstName, lastName, address }, callback) {
    try {
      await ContactModel.updateOne({ id }, { firstName, lastName, address }).exec();

      return callback(null);
    } catch (err) {
      return callback(err);
    }
  }

  async delete(id, callback) {
    try {
      await ContactModel.deleteOne({ id }).exec();
      callback(null);
    } catch (err) {
      callback(err);
    }
  }

  watch(callback) {
    console.warn("Watch is not implemented");
    callback(new Error("Watch is not implemented"));
  }
}

module.exports = MongoContactService;
