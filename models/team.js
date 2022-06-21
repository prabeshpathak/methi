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

// Mongoose hook to create the member as a lead of the team.
teamSchema.pre("save", function (next) {
  if (this.isNew) this.members.push(this.lead);
  next();
});

// Mongoose hook to delete the team id before adding it to the database. This is to prevent the team id from being added to the database.
teamSchema.pre("findOneAndDelete", async function (next) {
  const tid = this.getFilter()["_id"];
  await mongoose.model("MessageSchema").deleteMany({ team: tid });
  next();
});

module.exports = mongoose.model("TeamSchema", teamSchema);
