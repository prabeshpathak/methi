const mongoose = require("mongoose");
const Issue = require("./issue");

// Create a schema for the sprint model field type [String, Number, Date, Buffer, Boolean, ObjectId, Array]
const sprintSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  startDate: Date,
  endDate: Date,
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProjectSchema",
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  goal: String,
});

// remove the issue whose status is done before the document is saved to the database (pre) mongoose middleware function
sprintSchema.pre("findOneAndDelete", async function (next) {
  const sid = this.getFilter()["_id"];
  Issue.find({ sprint: sid }, (err, issues) => {
    if (err) return;
    issues.map((issue) => {
      if (issue.issueStatus === "done") issue.remove();
      else {
        issue.sprint = undefined;
        issue.save();
      }
    });
  });
  next();
});

module.exports = mongoose.model("SprintSchema", sprintSchema);
