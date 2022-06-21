const Message = require("../models/message");
const Team = require("../models/team");

/**
 *
 * @param {string} data - message data
 * @returns {Message} - message object
 * @description - create a new message
 */
exports.createMessage = async (data) => await Message.create(data);

/**
 *
 * @param {number} tid - team id
 * @param {number} uid - user id
 * @returns {boolean} - true if the user is a member of the team
 * @description - check if the user is a member of the team
 * @throws {Error} - if the user is not a member of the team
 */
exports.canMessage = async (tid, uid) => {
  const { members } = await Team.findById(tid).select("members");
  for (let i = 0; i < members.length; i++)
    if (members[i]?._id.toString() === uid) return true;
  return false;
};
