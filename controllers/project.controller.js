const Project = require("../models/project")
const Issue = require("../models/issue")

exports.createProject = async data => await Project.create(data);

exports.getProjects = async uid => await Project.find({ $or: [{ lead: uid }, { "_id": { $in: await Issue.find({ assignee: uid }).select("project").exec().then(ids => ids.map(p => p.project)) } }] })

exports.getLeadProjects = async uid => await Project.find({ lead: uid })

exports.getProject = async pid => await Project.findById(pid).populate("lead", "fullName")

exports.updateProject = async (pid, data) => await Project.findByIdAndUpdate(pid, data)

exports.deleteProject = async pid => await Project.findByIdAndDelete(pid)

exports.isProjectLead = async (pid, uid) => {
    const { lead } = await Project.findById(pid).select("lead")
    return lead.toString() === uid
}