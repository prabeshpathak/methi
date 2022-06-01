const mongoose = require("mongoose");
const Issue = require("./issue");

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
