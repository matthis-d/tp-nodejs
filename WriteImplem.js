const fs = require("fs");
const fsPromises = fs.promises;

exports.writeCallback = function writeCallback(contacts, callback) {
  // Read contacts.json
  fs.readFile("./contacts.json", (readErr) => {
    if (readErr) {
      return callback(readErr);
    }

    // Create a backup (contacts.json.back)
    fs.copyFile("./contacts.json", "./contacts.json.back", (copyError) => {
      if (copyError) {
        return callback(copyError);
      }

      // Rewrite contacts.json with new data
      fs.writeFile("./contacts.json", JSON.stringify(contacts), (writeError) => {
        // If an error occurs, rename contacts.json.back into contacts.json
        if (writeError) {
          console.error("Could not write file, use backup");
          fs.rename("./contacts.json.back", "./contacts.json", (renameErr) => {
            if (renameErr) {
              console.error("Could not use backup");
              return callback(renameErr);
            }

            return callback(writeError);
          });
        }

        // Delete backup if everything went fine.
        fs.unlink("./contacts.json.back", (unlinkErr) => {
          if (unlinkErr) {
            console.warn("Could not delete backup");
          }
          callback(null);
        });
      });
    });
  });
};

exports.writePromises = function writePromises(contacts, callback) {
  return fsPromises
    .readFile("./contacts.json")
    .then(() => fsPromises.copyFile("./contacts.json", "./contacts.json.back"))
    .then(() =>
      fsPromises
        .writeFile("./contacts.json", JSON.stringify(contacts))
        .catch(() => {
          console.error("Could not write file, use backup");
          return fsPromises.rename("./contacts.json.back", "./contacts.json");
        })
        .catch((renameErr) => {
          console.error("Could not use backup");
          throw renameErr;
        })
    )
    .then(() =>
      fsPromises
        .unlink("./contacts.json.back")
        .catch(() => console.warn("Could not delete backup"))
        .finally(() => callback(null))
    )
    .catch((err) => {
      callback(err);
    });
};

exports.writeAsync = async function writeAsync(contacts, callback) {
  try {
    await fsPromises.readFile("./contacts.json");
    await fsPromises.copyFile("./contacts.json", "./contacts.json.back");

    try {
      try {
        await fsPromises.writeFile("./contacts.json", JSON.stringify(contacts));
      } catch (e) {
        console.error("Could not write file, use backup");
        await fsPromises.rename("./contacts.json.back", "./contacts.json");
      }
    } catch (renameErr) {
      console.error("Could not use backup");
      throw renameErr;
    }

    return await fsPromises
      .unlink("./contacts.json.back")
      .catch(() => console.warn("Could not delete backup"))
      .finally(() => callback(null));
  } catch (err) {
    callback(err);
  }
};
