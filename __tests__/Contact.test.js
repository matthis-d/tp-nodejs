const Contact = require("../Contact");
const yargs = require("yargs");
const chalk = require("chalk");

jest.mock("yargs");

describe("Contact model", () => {
  describe("toString", () => {
    it("should return lastName in uppercase and firstName", () => {
      yargs.argv = {
        color: false,
      };

      const contact = new Contact({ firstName: "Matthis", lastName: "Duclos" });
      expect(contact.toString()).toEqual("DUCLOS Matthis");
    });

    it("should return lastName in uppercase and firstName with colors when option is enabled", () => {
      yargs.argv = {
        color: true,
      };

      const contact = new Contact({ firstName: "Matthis", lastName: "Duclos" });
      expect(contact.toString()).toEqual(`${chalk.blue("DUCLOS")} ${chalk.red("Matthis")}`);
    });
  });
});
