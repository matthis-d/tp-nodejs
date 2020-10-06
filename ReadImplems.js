const fs = require("fs");
const JSONStream = require("JSONStream");
const through2 = require("through2");
const Contact = require("./Contact");

exports.original = function readOriginal(path, callback) {
  fs.readFile(path, (err, data) => {
    if (err) {
      return callback(err);
    }

    try {
      callback(null, JSON.parse(data));
    } catch (error) {
      callback(error);
    }
  });
};

exports.stream = function readStream(path, callback) {
  const contacts = [];

  const convertToContact = through2.obj(function (data, enc, done) {
    const contact = new Contact(data);
    this.push(contact);
    done();
  });

  fs.createReadStream(path)
    .pipe(JSONStream.parse("*"))
    .pipe(convertToContact)
    .on("data", (contact) => {
      contacts.push(contact);
    })
    .on("finish", () => {
      callback(null, contacts);
    })
    .on("error", (err) => {
      console.error(err);
      callback(err);
    });
};
