const mongoose = require("mongoose");


const projectSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    key : {
        type : String,
        required : true,
    },
    lead : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "UserSchema"
    }
}, { timestamps: true });

projectSchema.pre("findOneAndDelete", async function(next) {
    const pid = this.getFilter()["_id"]
    await Issue.deleteMany({ project : pid })
    next()
})

module.exports = mongoose.model("ProjectSchema", projectSchema);