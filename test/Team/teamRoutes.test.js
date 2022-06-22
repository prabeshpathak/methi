const request = require("supertest");
const app = require("../../testingServer");
const mongoose = require("mongoose");
const Team = require("../../models/team");
const User = require("../../models/user");

const teamNew1 = {
  title: "Team Title",
  lead: "4edd40c86762e0fb12000001",
};

beforeAll(async () => {
  require("dotenv").config();
  await mongoose.connect(process.env.MONGODB_URI_TEST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await Team.deleteMany();
  await User.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Team Routes Test", function () {
  //   it("should get a valid token for user: user1", function (done) {
  //     request("/get/user")
  //       .set("Authorization", "Bearer " + token)
  //       .expect(200, done);
  //   });

  test("Creating New Test", async () => {
    const rest = await request(app)
      .post("/api/signin/register")
      .send({ email: "test", password: "123123", fullName: "Dont know" });

    await request(app)
      .post("/api/teams/create")
      .set("Authorization", "Bearer " + rest.body.token)
      .send({
        title: "testing@gmail.com",
        lead: rest.body.user._id,
      })
      .expect(200);
  });

  test("Getting Team", async () => {
    const rest = await request(app)
      .post("/api/signin/register")
      .send({ email: "test2", password: "123123", fullName: "Dont know" });

    await request(app)
      .get("/api/teams/")
      .set("Authorization", "Bearer " + rest.body.token)
      .expect(200);
  });
});
