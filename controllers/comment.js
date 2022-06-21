// importing the modules
const Comment = require("../models/comment");
const Issue = require("../models/issue");
const Project = require("../models/project");

/**
 *
 * @param {object} data - comment data
 * @returns {Comment} - comment object
 * @description - create a new comment
 * @throws - if the comment is not created
 */
exports.createComment = async (data) => await Comment.create(data);

/**
 *
 * @param {number} issueId - issue id
 * @returns {Comment[]} - comment array
 * @description - get all the comments for the issue
 * @throws - if the comments are not found
 */
exports.getComments = async (issueId) =>
  await Comment.find({ issue: issueId }).populate([
    { path: "user", select: "fullName" },
  ]);

/**
 *
 * @param {number} cid - comment id
 * @param {string} data - data to be updated
 * @returns {Comment} - comment object
 * @description - update the comment
 */
exports.updateComment = async (cid, data) =>
  await Comment.findByIdAndUpdate(cid, data);

/**
 *
 * @param {number} cid - comment id
 * @returns {Comment} - comment object
 * @description - delete the comment
 */
exports.deleteComment = async (cid) => await Comment.findByIdAndDelete(cid);

/**
 *
 * @param {number} iId - issue id of the project
 * @param {string} user  - user id
 * @returns {boolean,Issue{}} - true if the user has permission to comment on the issue
 * @description - check if the user has permission to comment
 * @throws - if the user is not found
 */
exports.canComment = async (iId, user) => {
  const issue = await Issue.findById(iId).select("project");
  const project = await Project.findById(issue.project._id).select("lead");
  if (project.lead.toString() === user) return true;

  return await Issue.findOne({
    $and: [{ project: project._id }, { assignee: user }],
  });
};

/**
 *
 * @param {number} cid
 * @param {number} uid
 * @returns {boolean} - if the user is the owner of the comment
 * @description - has the permission to delete the comment
 */
exports.hasDeletePermission = async (cid, uid) => {
  const comment = await Comment.findById(cid).select("user");
  return comment.user.toString() === uid;
};
