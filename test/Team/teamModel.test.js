const mongoose = require("mongoose");
const teamSchema = require("../../models/team");

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
  await teamSchema.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Testing container for Team", () => {
  // the code below is for insert testing
  it("Adding New Team", () => {
    const teams = new teamSchema();

    teams.lead = "4edd40c86762e0fb12000001";
    teams.members = ["4edd40c86762e0fb12000001"];
    teams.title = "Team Test";
    teams.description = "test description";
    teams.messages = ["4edd40c86762e0fb12000001"];

    return teams.save().then((pro_ret) => {
      expect(pro_ret.title).toEqual("Team Test");
    });
  });

  // the code below is for get testing
  it("Getting Team", async () => {
    const teams = await teamSchema.findOne({ title: "Team Test" });
    expect(teams.title).toEqual("Team Test");
  });

  // the code below is for updating team
  it("Updating Team", async () => {
    return await teamSchema
      .findOneAndUpdate(
        { title: "Team Test" },
        { $set: { description: "new test" } },
        { new: true }
      )
      .then((val) => {
        expect(val.description).toEqual("new test");
      });
  });
});
