const request = require("supertest");
const app = require("../testingServer");
const mongoose = require("mongoose");
const User = require("../models/user");

const userLoginTest1 = {
  email: "testing1@gmail.com",
  password: "testing1",
};

beforeAll(async () => {
  require("dotenv").config();
  await mongoose.connect(process.env.MONGODB_URI_TEST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await User.deleteMany();
  await User(userLoginTest1).save();
});

afterAll(async () => {
  await mongoose.connection.close();
});

test("Sign Up for a User", async () => {
  await request(app)
    .post("/api/signin/register")
    .send({
      email: "testing@gmail.com",
      fullname: "Testing 123",
      password: "testing123",
    })
    .expect(201);
});

test("Login in for a User", async () => {
  await request(app).post("/api/signin/login").send(userLoginTest1);
});
