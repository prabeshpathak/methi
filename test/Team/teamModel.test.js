const mongoose = require("mongoose");
const teamSchema = require("../../models/team");

// use the new name of the database
const url = beforeAll(async () => {
  require("dotenv").config();
  await mongoose.connect(process.env.MONGODB_URI_TEST, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
  });
  await userSchema.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Testing container for Team", () => {});
