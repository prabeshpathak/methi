const Project = require("../models/project")


exports.createProject = async data => await Project.create(data);




