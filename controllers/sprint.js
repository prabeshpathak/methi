const Sprint = require("../models/sprint");

exports.createSprint = async data => await Sprint.create(data);

exports.getSprint = async pid => await Sprint.findById(pid)

exports.getSprints = async pid => await Sprint.find({ project : pid })

exports.getActiveSprint = async pid => await Sprint.findOne({$and : [{project : pid}, { isActive : true}]}).populate("project", "title")

exports.updateSprint = async (id, data) => await Sprint.findByIdAndUpdate(id, data)

exports.deleteSprint = async id => await Sprint.findByIdAndDelete(id)