const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: String,
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 6,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("UserSchema", userSchema);
