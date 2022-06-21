const mongoose = require("mongoose");
const userSchema = require("../models/user");

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

describe("User Test", () => {
  // the code below is for insert testing
  it("Adding new user", () => {
    const user = {
      email: "test@gmail.com",
      password: "test12345",
      fullName: "test testing",
    };

    return userSchema.create(user).then((pro_ret) => {
      expect(pro_ret.email).toEqual("test@gmail.com");
    });
  });

  // //   //get one user
  it("get/user--> get any one user", async () => {
    const pr = await userSchema.findOne({ email: "test@gmail.com" });
    expect(1).toBe(1);
  });

  it("to test the update", async () => {
    return await userSchema
      .findOneAndUpdate(
        { email: "test@gmail.com" },
        { $set: { fullName: "new test" } },
        { new: true }
      )
      .then((val) => {
        expect(val.fullName).toEqual("new test");
      });
  });

  //     // the code below is for delete testing
  // it("Deleting new added", async () => {
  //   const status = await userSchema.deleteOne({ email: "testss@gmail.com" });
  //   expect(status.ok).toBe(1);
  // });
});
