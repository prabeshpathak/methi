const mongoose = require("mongoose");

// Create a schema for the issue model field type [String, Number, Date, Buffer, Boolean, ObjectId, Array]
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

issueSchema.pre("findOneAndUpdate", async function (next) {
  if (this.getUpdate().epic === "") {
    this.getUpdate().epic = undefined;
    const doc = await this.model.findOne(this.getQuery());
    doc.epic = undefined;
    doc.save();
  }
  if (this.getUpdate().sprint === "") {
    this.getUpdate().sprint = undefined;
    const doc = await this.model.findOne(this.getQuery());
    doc.sprint = undefined;
    doc.save();
  }
  if (this.getUpdate().assignee === "") {
    this.getUpdate().assignee = undefined;
    const doc = await this.model.findOne(this.getQuery());
    doc.assignee = undefined;
    doc.save();
  }
  next();
});

module.exports = mongoose.model("IssueSchema", issueSchema);
