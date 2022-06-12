const Comment = require("../models/comment");
const Issue = require("../models/issue");
const Project = require("../models/project");

exports.createComment = async data => await Comment.create(data);

exports.getComments = async issueId => await Comment.find({issue : issueId}).populate([{ path: "user", select: "fullName" }])

exports.updateComment = async (cid, data) => await Comment.findByIdAndUpdate(cid, data)

exports.deleteComment = async cid => await Comment.findByIdAndDelete(cid)

exports.canComment = async (iId, user) => {
    const issue = await Issue.findById(iId).select("project")
    const project = await Project.findById(issue.project._id).select("lead")
    if(project.lead.toString() === user)
        return true;
    
    return await Issue.findOne({ $and : [{project : project._id}, {assignee : user}] })
}

exports.hasDeletePermission = async (cid, uid) => {
    const comment = await Comment.findById(cid).select("user")
    return comment.user.toString() === uid;
}