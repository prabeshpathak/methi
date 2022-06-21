const Project = require("../models/project");
const Issue = require("../models/issue");

/**
 *
 * @param {string} data - project data
 * @returns {Project} - project object
 * @description - create a new project
 */
exports.createProject = async (data) => await Project.create(data);

/**
 *
 * @param {number} uid - user id
 * @returns {Project[]} - project array
 * @description - get all the projects for the user
 */
exports.getProjects = async (uid) =>
  await Project.find({
    $or: [
      { lead: uid },
      {
        _id: {
          $in: await Issue.find({ assignee: uid })
            .select("project")
            .exec()
            .then((ids) => ids.map((p) => p.project)),
        },
      },
    ],
  });

/**
 *
 * @param {number} uid - user id
 * @returns {Project[]} - project array where the user is a lead
 * @description - get all the projects where the user is a lead
 * @throws {Error} - if the user is not a lead
 */
exports.getLeadProjects = async (uid) => await Project.find({ lead: uid });

/**
 *
 * @param {number} pid - project id
 * @returns {Project} - project object
 * @description - get the project and populate the lead
 */
exports.getProject = async (pid) =>
  await Project.findById(pid).populate("lead", "fullName");

/**
 *
 * @param {number} pid - project id
 * @param {string} data - project data
 * @returns {Project} - project object
 * @description - update the project
 * @returns
 */
exports.updateProject = async (pid, data) =>
  await Project.findByIdAndUpdate(pid, data);

/**
 *
 * @param {number} pid - project id
 * @returns {Issue} - issue object
 * @description - delete the project
 */
exports.deleteProject = async (pid) => await Project.findByIdAndDelete(pid);

/**
 *
 * @param {number} pid - project id
 * @param {number} uid - user id
 * @returns {boolean} - true if the user is a lead
 * @description - check if the user is a lead
 * @throws {Error} - if the user is not a lead
 */
exports.isProjectLead = async (pid, uid) => {
  const { lead } = await Project.findById(pid).select("lead");
  return lead.toString() === uid;
};
