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


module.exports = mongoose.model("SprintSchema", sprintSchema);
