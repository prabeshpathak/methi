// importing the modules
const Issue = require("../models/issue");
const { isProjectLead } = require("./project");

/**
 *
 * @param {string} data - issue data
 * @returns {Issue} - issue object
 * @description - create a new issue
 */
exports.createIssue = async (data) => await Issue.create(data);

/**
 *
 * @param {number} uid - user id
 * @returns {Issue[]} - issue array
 * @description - get all the issues for the user
 */
exports.getIssues = async (uid) =>
  await Issue.find({ assignee: uid }).populate([
    { path: "project", select: "title" },
  ]);

/**
 *
 * @param {number} id - issue id
 * @returns {Issue} - issue object
 * @description - get the issue
 */
exports.getIssue = async (id) =>
  await Issue.findById(id).populate([
    { path: "project", select: "title lead" },
    { path: "sprint", select: "title" },
    { path: "assignee", select: "fullName" },
    { path: "epic", select: "summary" },
  ]);

/**
 *
 * @param {number} pid - project id
 * @returns {Issue[]} - issue array
 * @description - get all the epic issues for the project and populate the assignee
 */
exports.backlogIssues = async (pid) =>
  await Issue.find({
    $and: [{ project: pid }, { issueType: { $ne: "Epic" } }],
  }).populate([
    { path: "assignee", select: "fullName" },
    { path: "epic", select: "summary" },
  ]);

/**
 *
 * @param {number} pid - project id
 * @returns {Issue[]} - issue array
 * @description - get all the details for epic issues for the project
 */
exports.epicIssues = async (pid) =>
  await Issue.find({ $and: [{ project: pid }, { issueType: "Epic" }] }).select(
    "summary"
  );

/**
 *
 * @param {number} sid - sprint id
 * @returns {Sprint[]} - active sprint object
 * @description - get the active sprint
 */
exports.activeSprintIssues = async (sid) =>
  await Issue.find({ sprint: sid }).populate("assignee", "fullName");

/**
 *
 * @param {number} id - issue id
 * @param {string} data - issue data
 * @returns {Issue} - issue object
 * @description - update the issue
 */
exports.updateIssue = async (id, data) =>
  await Issue.findByIdAndUpdate(id, data);

/**
 *
 * @param {number} pid - project id
 * @returns {Issue[]} - issue array with type as epic and assignee as null
 * @description - get all the roadmap issues for the project
 */
exports.getRoadmap = async (pid) => {
  const epics = await Issue.find({
    $and: [{ project: pid }, { issueType: "Epic" }],
  });
  const issues = await Issue.find({
    $and: [{ project: pid }, { issueType: { $ne: "Epic" } }],
  }).populate("assignee", "fullName");
  const response = epics.map((e) => {
    const epic = e.toObject();
    epic.issues = [];
    for (const issue of issues)
      if (issue.epic?.toString() === e._id.toString()) epic.issues.push(issue);
    return epic;
  });
  return response;
};

/**
 *
 * @param {number} id - project id
 * @param {number} uid - user id
 * @returns {boolean} - true if the user is the project lead and he can delete the issue
 */
exports.deleteIssue = async (id, uid) => {
  const { project } = await Issue.findById(id).select("project");
  if (await isProjectLead(project, uid)) {
    await Issue.findByIdAndDelete(id);
    return true;
  } else return false;
};
