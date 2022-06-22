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
    const project = new projectSchema();

    project.title = "Team Test";
    project.key = "4edd40c86762e0fb12000001";
    project.lead = ["4edd40c86762e0fb12000001"];

    return project.save().then((pro_ret) => {
      expect(pro_ret.title).toEqual("Team Test");
    });
  });

  // the code below is for get testing
  it("Getting Project", async () => {
    const project = await projectSchema.findOne({ title: "Team Test" });
    expect(project.title).toEqual("Team Test");
  });

  // the code below is for updating project
  it("Updating Project", async () => {
    return await projectSchema
      .findOneAndUpdate(
        { title: "Team Test" },
        { $set: { key: "new test" } },
        { new: true }
      )
      .then((val) => {
        expect(val.key).toEqual("new test");
      });
  });
});
