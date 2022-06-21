const mongoose = require("mongoose");
const Issue = require("./issue");

// Create a schema for the project model field type [String, Number, Date, Buffer, Boolean, ObjectId, Array]

const projectSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    key: {
      type: String,
      required: true,
    },
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserSchema",
    },
  },
  { timestamps: true }
);

//Mongoose hook to delete the project id before adding it to the database. This is to prevent the project id from being added to the database. 
projectSchema.pre("findOneAndDelete", async function (next) {
  const pid = this.getFilter()["_id"];
  await Issue.deleteMany({ project: pid });
  next();
});

module.exports = mongoose.model("ProjectSchema", projectSchema);
