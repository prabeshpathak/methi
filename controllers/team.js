const Team = require("../models/team");
const User = require("../models/user");

// accepts a team object and creates a new team
exports.createTeam = async (data) => await Team.create(data);

// accept a user id and return all the teams that the user is a member of
exports.getTeams = async (uid) => await Team.find({ members: { $in: uid } });

// accepts a new team data and updates the team
exports.updateTeam = async (id, body) => await Team.findByIdAndUpdate(id, body);

// get all the teams populating user and members along with the message thread
exports.getTeam = async (id) =>
  await Team.findById(id).populate([
    { path: "members" },
    { path: "messages", populate: { path: "user" } },
  ]);

//   delete a team using the team id
exports.deleteTeam = async (id) => await Team.findByIdAndDelete(id);

/**
 *
 * @param {extended} query - query object
 * @param {string} team - team module
 * @returns {User[]} - user array
 * @description - search for users as if they were in a new team
 */
exports.search = async (query, team) => {
  const users = await User.find({
    $or: [
      { email: { $regex: query, $options: "i" } },
      { fullName: { $regex: query, $options: "i" } },
    ],
  });
  if (team === "new") return users;
  let { members } = await Team.findById(team).select("members");
  members = members.map((m) => m?.toString());
  return users.filter(({ _id }) => !members.includes(_id?.toString()));
};

/**
 *
 * @param {string} data - team data
 * @param {id} user - user id
 * @returns {User} - user object
 * @description - add user to team
 * @throws {Error} - if user is already on the team
 */
exports.addToTeam = async (data, user) => {
  const team = await Team.findById(data.team);
  if (team.lead.toString() !== user) return;
  // loop through members and check if user is already in the team
  for (const member of team.members)
    if (member?.toString() === data.member) return;

  team.members.push(data.member);
  await team.save();
  return await User.findById(data.member);
};

/**
 *
 * @param {string} data
 * @param {id} user
 * @returns {Team} - team object
 * @description - remove user from team
 * @throws {Error} - if user is not on the team or if user is  the lead
 */
exports.removeFromTeam = async (data, user) => {
  const team = await Team.findById(data.team);
  // check if user is lead
  if (team.lead.toString() !== user || team.lead.toString() === data.member)
    return;
  // check if user is in the team
  team.members = team.members.filter((m) => m?.toString() !== data.member);
  await team.save();
};

/**
 *
 * @param {object} lead - lead data
 * @returns {Team[]} - team array
 * @description - get all the teams members where the user is a lead
 * @throws {Error} - if the member is not greater than zero
 */
exports.getTeamAssignees = async (lead) => {
  const teams = await Team.find({ lead: lead });
  const memberIds = [];
  for (const t of teams) t.members.forEach((id) => id && memberIds.push(id));
  if (memberIds.length > 0)
    return await User.find({ _id: { $in: memberIds } }).select("fullName");
  else return [await User.findById(lead).select("fullName")];
};
