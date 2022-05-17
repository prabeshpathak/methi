const express = require("express");

const app = express();

app.use("/api/auth", require("./auth"));

module.exports = app;
