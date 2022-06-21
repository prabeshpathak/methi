const Sprint = require("../models/sprint");

/**
 *
 * @param {string} data - sprint data
 * @returns {Sprint} - sprint object
 * @description - create a new sprint
 */
exports.createSprint = async (data) => await Sprint.create(data);

/**
 *
 * @param {number} pid - project id
 * @returns {Sprint[]} - sprint array
 * @description - get all the sprints for the project
 */
exports.getSprint = async (pid) => await Sprint.findById(pid);

exports.getSprints = async (pid) => await Sprint.find({ project: pid });

/**
 *
 * @param {number} pid - project id
 * @returns {Sprint[]} - active sprint array
 * @description - get all the active sprints for the project (sprints that are not completed) and populate the project field
 */
exports.getActiveSprint = async (pid) =>
  await Sprint.findOne({
    $and: [{ project: pid }, { isActive: true }],
  }).populate("project", "title");

/**
 *
 * @param {number} id - sprint id
 * @param {string} data - sprint data
 * @returns {Sprint} - sprint object
 * @description - update a sprint
 */
exports.updateSprint = async (id, data) =>
  await Sprint.findByIdAndUpdate(id, data);

/**
 * 
 * @param {number} id - sprint id
   @returns {Sprint} - sprint object
    @description - delete a sprint
 */
exports.deleteSprint = async (id) => await Sprint.findByIdAndDelete(id);
