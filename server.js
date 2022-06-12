const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
// const routes = require("./routes");

const app = express();
app.use(express.json());
app.use(cors());

require("dotenv").config();
if (process.env.NODE_ENV == "development") {
  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connection with DB established");
    })
    .catch((err) => {
      console.log(err);
    });
}

// Routes
app.use("/api/home", require("./api/home"));
app.use("/api/signin", require("./api/signIn"));
app.use("/api/projects", require("./api/project"));
app.use("/api/issues", require("./api/issue"));
app.use("/api/sprints", require("./api/sprint"));
app.use("/api/teams", require("./api/team"));
app.use("/api/comments", require("./api/comment"));
app.use("/api/messages", require("./api/message"));

if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 8000;
app.listen(port, () => console.log("listening on " + port));
