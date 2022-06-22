const mongoose = require("mongoose");
const issueSchema = require("../../models/issue");

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
  await issueSchema.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Testing container for Issue", () => {
  // the code below is for insert testing
  it("Adding New Issue", () => {
    const issue = new issueSchema();

    issue.summary = "Team Test";
    issue.issueType = "Team Test";
    issue.description = "Team Test";
    issue.project = "4edd40c86762e0fb12000001";
    issue.assignee = "4edd40c86762e0fb12000001";
    issue.labels = ["hi"];
    issue.sprint = ["4edd40c86762e0fb12000001"];
    issue.epic = ["4edd40c86762e0fb12000001"];

    return issue.save().then((pro_ret) => {
      expect(pro_ret.summary).toEqual("Team Test");
    });
  });
});
