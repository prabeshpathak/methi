const mongoose = require("mongoose");
const projectSchema = require("../../models/project");

// use the new name of the database
beforeAll(async () => {
  require("dotenv").config();
  await mongoose.connect(process.env.MONGODB_URI_TEST, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
  });
  await projectSchema.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Testing container for Project", () => {
  // the code below is for insert testing
  it("Adding New Project", () => {
    const teams = new projectSchema();

    teams.title = "Team Test";
    teams.key = "4edd40c86762e0fb12000001";
    teams.lead = ["4edd40c86762e0fb12000001"];

    return teams.save().then((pro_ret) => {
      expect(pro_ret.title).toEqual("Team Test");
    });
  });
});
