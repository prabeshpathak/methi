const Project = require("../models/project");

exports.createProject = async (data) => await Project.create(data);

exports.getProjects = async (uid) => await Project.find({});

exports.getLeadProjects = async (uid) => await Project.find({ lead: uid });

exports.getProject = async (pid) =>
  await Project.findById(pid).populate("lead", "fullName");

exports.updateProject = async (pid, data) =>
  await Project.findByIdAndUpdate(pid, data);

exports.deleteProject = async (pid) => await Project.findByIdAndDelete(pid);

exports.isProjectLead = async (pid, uid) => {
  const { lead } = await Project.findById(pid).select("lead");
  return lead.toString() === uid;
};
