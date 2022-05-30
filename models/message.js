const mongoose = require("mongoose");
const Team = require("../models/team")

const messageSchema = mongoose.Schema({
    body: {
        type: String,
        required: true,
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "UserSchema",
        required : true
    },
    team : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "TeamSchema",
        required : true
    }
}, { timestamps: true });

messageSchema.pre("save", async function (next) {
    if (this.isNew) {
        const team = await Team.findById(this.team)
        team.messages.push(this)
        await team.save()
    }
    next()
})


module.exports = mongoose.model("MessageSchema", messageSchema);