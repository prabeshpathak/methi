const mongoose = require("mongoose");

// Create a schema for the comment model field type [String, Number, Date, Buffer, Boolean, ObjectId, Array]
const commentSchema = mongoose.Schema(
  {
    body: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserSchema",
      required: true,
    },
    issue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IssueSchema",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CommentSchema", commentSchema);
