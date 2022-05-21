const Team = require("../models/team");

exports.createTeam = async (data) => await Team.create(data);

exports.getTeams = async (uid) => await Team.find({ members: { $in: uid } });

exports.updateTeam = async (id, body) => await Team.findByIdAndUpdate(id, body);

exports.getTeam = async (id) =>
  await Team.findById(id).populate([
    { path: "members" },
    { path: "messages", populate: { path: "user" } },
  ]);

exports.deleteTeam = async (id) => await Team.findByIdAndDelete(id);
