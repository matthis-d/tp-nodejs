function router(app, contactService) {
  app.get("/hello", (req, res) => {
    res.status(200).send("Hello from router");
  });

  app.get("/rest/contacts", (req, res) => {
    contactService.get((err, contacts) => {
      if (err) {
        return res.sendStatus(500);
      }

      res.status(200).json(contacts);
    });
  });

  app.get("/rest/contacts/:id", (req, res) => {
    contactService.get((err, contacts) => {
      if (err) {
        return res.sendStatus(500);
      }

      const foundContact = contacts.find(
        (ctc) => ctc.id === parseInt(req.params.id, 10)
      );
      if (foundContact) {
        return res.status(200).json(foundContact);
      }

      return res.sendStatus(404);
    });
  });

  app.post("/rest/contacts", (req, res) => {
    const { firstName, lastName } = req.body;

    contactService.add(firstName, lastName, (err) => {
      if (err) {
        return res.sendStatus(500);
      }
      return res.sendStatus(204);
    });
  });

  app.put("/rest/contacts/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { firstName, lastName, address } = req.body;

    contactService.update(id, { firstName, lastName, address }, (err) => {
      if (err) {
        return res.sendStatus(500);
      }
      return res.sendStatus(204);
    });
  });
}

module.exports = router;
