const mongoose = require("mongoose");
const Issue = require("./issue");

const sprintSchema = mongoose.Schema({});
module.exports = mongoose.model("SprintSchema", sprintSchema);
