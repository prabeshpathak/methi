const mongoose = require("mongoose");

// Create a schema for the team model field type [String, Number, Date, Buffer, Boolean, ObjectId, Array]
const teamSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  lead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserSchema",
    required: true,
  },
  description: String,
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserSchema",
    },
  ],
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MessageSchema",
    },
  ],
});

teamSchema.pre("save", function (next) {
  if (this.isNew) this.members.push(this.lead);
  next();
});

teamSchema.pre("findOneAndDelete", async function (next) {
  const tid = this.getFilter()["_id"];
  await mongoose.model("MessageSchema").deleteMany({ team: tid });
  next();
});

module.exports = mongoose.model("TeamSchema", teamSchema);
