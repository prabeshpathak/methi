const mongoose = require("mongoose");

const issueSchema = mongoose.Schema(
  {
    summary: {
      type: String,
      required: true,
    },
    issueType: {
      type: String,
      required: true,
    },
    description: String,
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProjectSchema",
      required: true,
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserSchema",
    },
    labels: [String],
    issueStatus: {
      type: String,
      default: "to do",
    },
    sprint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SprintSchema",
    },
    epic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IssueSchema",
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("IssueSchema", issueSchema);
