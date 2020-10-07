const ContactService = require("../ContactService");

describe("ContactService", () => {
  let contactService;

  beforeEach(() => {
    contactService = new ContactService();
  });

  it("should be able to get contacts", () => {
    expect.assertions(1);

    contactService.get((err, contacts) => {
      if (err) {
        throw new Error("Get is not working");
      }

      expect(contacts[0].toString()).toMatch(/^[A-Z]+ \w+$/);
    });
  });
});
