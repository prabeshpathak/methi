const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const Project = require("../models/project");

exports.registerUser = async (data) => await User.create(data);

exports.getUser = async id => await User.findById(id)

exports.login = async ({ email, password }) => {
	const user = await User.findOne({ email }).select("+password")
	if(!user)
		return null;
	if(await bcrypt.compare(password, user.password)) {
		const token = this.generateAccessToken(user)
		const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
		return { token, user : decoded }
	}
	else
		return null;
}

exports.generateAccessToken = (user) =>
	jwt.sign(user.toJSON(), process.env.TOKEN_SECRET, { expiresIn: "6h" });

exports.authenticateToken = (req, res, next) => {
	const header = req.header("Authorization");
	const token = header && header.split(" ")[1];
	if (token == null) return res.sendStatus(401);

	jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
		if (err) return res.status(403).send("Token is invalid");
		req.user = user;
		next();
	});
};

exports.authorizations = async (req, res, next) => {
	const project = await Project.findById(req.body.project).select("lead")
    if(!project || project.lead.toString() !== req.user._id)
		return res.status(401).send("Not authorized to modify project");
	next();
};