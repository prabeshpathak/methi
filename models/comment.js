const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
    body: {
        type: String,
        required: true,
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "UserSchema",
        required : true
    },
    issue : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "IssueSchema",
        required : true
    }
}, { timestamps: true });

module.exports = mongoose.model("CommentSchema", commentSchema);