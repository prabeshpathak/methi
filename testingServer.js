const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
// const routes = require("./routes");

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/signin", require("./api/signin"));
app.use("/api/teams", require("./api/team"));

module.exports = app;
