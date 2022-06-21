const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Create a schema for the user model field type [String, Number, Date, Buffer, Boolean, ObjectId, Array]
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

// Hash the password before saving-to-db (pre-save hook) (https://mongoosejs.com/docs/middleware.html)

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("UserSchema", userSchema);
