const fs = require("fs");

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
