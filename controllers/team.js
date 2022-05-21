const Team = require("../models/team");
const User = require("../models/user");

exports.createTeam = async data => await Team.create(data);

exports.getTeams = async uid => await Team.find({'members' : { $in: uid }})

exports.updateTeam = async (id, body) => await Team.findByIdAndUpdate(id, body)

exports.getTeam = async id => await Team.findById(id).populate([{path: "members"}, {path: "messages", populate: {path:"user"}}])

exports.deleteTeam = async id => await Team.findByIdAndDelete(id)

exports.search = async (query, team) => {
    const users = await User.find({ $or: [{email: {$regex: query, $options: 'i'}}, { fullName:  {$regex: query, $options: 'i'}}] })
    if(team === "new")
        return users
    let { members } = await Team.findById(team).select("members")
    members = members.map(m => m?.toString())
    return users.filter(({_id}) => !members.includes(_id?.toString()))
}

exports.addToTeam = async (data, user) => {
    const team = await Team.findById(data.team)
    if (team.lead.toString() !== user) return
    for (const member of team.members)
        if (member?.toString() === data.member) return

    team.members.push(data.member)
    await team.save()
    return await User.findById(data.member)
}

exports.removeFromTeam = async (data, user) => {
    const team = await Team.findById(data.team)
    if ((team.lead.toString() !== user) || (team.lead.toString() === data.member)) return
    team.members = team.members.filter(m => m?.toString() !== data.member)
    await team.save()
}

exports.getTeamAssignees = async lead => {
    const teams = await Team.find({ lead: lead })
    const memberIds = []
    for (const t of teams)
        t.members.forEach(id => id && memberIds.push(id))
    if(memberIds.length > 0)
        return await User.find({ _id: { $in: memberIds } }).select("fullName")
    else 
        return [await User.findById(lead).select("fullName")]
}