const yargs = require("yargs");

const Server = require("./Server");

function run(contactService) {
  yargs
    .scriptName("contacts.js")
    .usage("$0 <cmd> [args]")
    .option("color", {
      alias: "c",
      type: "boolean",
      default: false,
      describe: "Print list in colors",
    })
    .command(
      "list",
      "List all contacts",
      () => {},
      () => {
        contactService.print();
      }
    )
    .command(
      "add",
      "Add a contact",
      (args) => {
        args
          .positional("firstName", {
            type: "string",
            required: true,
            describe: "Contact's firstName",
          })
          .positional("lastName", {
            type: "string",
            required: true,
            describe: "Contact's lastName",
          });
      },
      (argv) => {
        contactService.add(argv.firstName, argv.lastName, () => {
          contactService.print();
        });
      }
    )
    .command(
      "delete",
      "Delete a contact",
      (args) => {
        args.positional("id", {
          type: "nummber",
          required: true,
          describe: "The id of the contact to delete",
        });
      },
      (argv) => {
        contactService.delete(argv.id, (err) => {
          if (err) {
            console.error(err);
          } else {
            contactService.print();
          }
        });
      }
    )
    .command(
      "serve",
      "Start a web server",
      () => {},
      () => {
        Server.start(contactService);
      }
    )
    .help().argv;
}

exports.run = run;
