const mongoose = require("mongoose");
const sprintSchema = require("../../models/sprint");

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
  await sprintSchema.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Testing container for Sprint", () => {
  // the code below is for insert testing
  it("Adding New Sprint", () => {
    const sprint = new sprintSchema();

    sprint.project = "4edd40c86762e0fb12000001";
    sprint.isActive = true;
    sprint.title = "Team Test";
    sprint.startDate = new Date();
    sprint.endDate = new Date();
    sprint.goal = "test description";

    return sprint.save().then((pro_ret) => {
      expect(pro_ret.title).toEqual("Team Test");
    });
  });

  // the code below is for get testing
  it("Getting Sprint", async () => {
    const teams = await sprintSchema.findOne({ title: "Team Test" });
    expect(teams.title).toEqual("Team Test");
  });

  // the code below is for updating sprint
  it("Updating Sprint", async () => {
    return await sprintSchema
      .findOneAndUpdate(
        { title: "Team Test" },
        { $set: { goal: "new test" } },
        { new: true }
      )
      .then((val) => {
        expect(val.goal).toEqual("new test");
      });
  });
});
