const Message = require("../models/message");
const Team = require("../models/team");

exports.createMessage = async data => await Message.create(data);

exports.canMessage = async (tid, uid) => {
    const { members } = await Team.findById(tid).select("members")
    for (let i = 0; i < members.length; i++)
        if(members[i]?._id.toString() === uid) 
            return true;
    return false;
}