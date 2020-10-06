function router(app, contactService) {
  app.get("/hello", (req, res) => {
    res.status(200).send("Hello from router");
  });
}

module.exports = router;
