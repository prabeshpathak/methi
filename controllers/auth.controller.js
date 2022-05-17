const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.registerUser = async (data) => await User.create(data);

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) return null;
  if (await bcrypt.compare(password, user.password)) {
    const token = this.generateAccessToken(user);
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    return { token, user: decoded };
  } else return null;
};

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
