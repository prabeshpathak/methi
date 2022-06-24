// importing the required module
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();
const app = express();

// middleware
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
      const port = process.env.PORT || 8000;
      app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

if (process.env.NODE_ENV == "test") {
  mongoose
    .connect(process.env.MONGODB_URI_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      const port = process.env.PORT || 8000;
      app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    })
    .catch((err) => {
      console.log(err);
    });

  async function dbClean() {
    const db = await mongoose.connection;

    let collections = db.collections;

    for (let collection in collections) {
      await collections[collection].deleteMany();
    }
    console.log("All DB Cleared");
  }

  dbClean();
}

// importing the routes
app.use("/api/home", require("./api/home"));
app.use("/api/signin", require("./api/signin"));
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
