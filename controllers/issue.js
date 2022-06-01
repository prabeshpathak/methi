const Issue = require("../models/issue");
const { isProjectLead } = require("./project");

exports.createIssue = async data => await Issue.create(data);

exports.getIssues = async uid => await Issue.find({ assignee: uid }).populate([{ path: "project", select: "title" }])

exports.getIssue = async id => await Issue.findById(id).populate([{ path: "project", select: "title lead" }, { path: "sprint", select: "title" }, { path: "assignee", select: "fullName" }, { path: "epic", select: "summary" }])

exports.backlogIssues = async pid => await Issue.find({ $and: [{ project: pid }, { issueType: { $ne: "Epic" } }] }).populate([{path : "assignee", select : "fullName"}, {path : "epic", select : "summary"}])

exports.epicIssues = async pid => await Issue.find({ $and: [{ project: pid }, { issueType: "Epic" }] }).select("summary")

exports.activeSprintIssues = async sid => await Issue.find({ sprint: sid }).populate("assignee", "fullName")

exports.updateIssue = async (id, data) => await Issue.findByIdAndUpdate(id, data)



exports.deleteIssue = async (id, uid) => {
    const { project } = await Issue.findById(id).select("project")
    if(await isProjectLead(project, uid)) {
        await Issue.findByIdAndDelete(id)
        return true;
    } else
        return false
}