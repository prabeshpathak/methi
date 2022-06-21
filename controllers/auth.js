// importing modules
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const Project = require("../models/project");
const express = require("express");

// exporting the registered user model and getting the user
exports.registerUser = async (data) => await User.create(data);
exports.getUser = async (id) => await User.findById(id);

/**
 *
 * @param {number} uid - user id
 * @param {string} data - data to be updated
 * @returns {User} updated user
 * @description - update the user data
 * @throws - if the user is not found
 */
exports.updateUser = async (uid, data) => {
  const u = await User.findByIdAndUpdate(uid, data);
  return u;
};

/**
 *
 * @param {string} email - user email
 * @param {string} password - user password
 * @returns {object} user - user object
 * @description - find the user by email and compare the password
 * @throws - if the user is not found or the password is incorrect
 */
exports.login = async ({ email, password }) => {
  // find user by email and select the respective password
  const user = await User.findOne({ email }).select("+password");
  if (!user) return null;
  // compare the password with the hashed password and return the user if the password is correct and decode the token
  if (await bcrypt.compare(password, user.password)) {
    const token = this.generateAccessToken(user);
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    return { token, user: decoded };
  } else return null;
};

/**
 *
 * @param {object} user - user object
 * @returns {string} - jwt token for the user along with the expiry time
 */
exports.generateAccessToken = (user) =>
  jwt.sign(user.toJSON(), process.env.TOKEN_SECRET, { expiresIn: "6h" });

/**
 * @param {express.Request} req - request object
 * @param {express.Response} res - response object
 * @param {express.NextFunction} next - next function
 * @returns {object} - return the verified user object
 * @description - verify the token and return the user object
 * @throws - if the token is not verified
 */
exports.authenticateToken = (req, res, next) => {
  // get the token from the header and check if it is valid
  const header = req.header("Authorization");
  const token = header && header.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  // verify the token and return the user object
  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).send("Token is invalid");
    req.user = user;
    next();
  });
};

/**
 * @param {express.Request} req - request object
 * @param {express.Response} res - response object
 * @param {express.NextFunction} next - next function
 * @returns {express.Response} - return the response object where user can be authorized to access the project
 * @description - check if the user is a lead of the project
   @throws {Error} - throws an error if the user is not authorized to access the project
 */

exports.authorizations = async (req, res, next) => {
  // find the project where the signed in user is a lead
  const project = await Project.findById(req.body.project).select("lead");
  // check if the user is a lead of the project
  if (!project || project.lead.toString() !== req.user._id)
    return res.status(401).send("Not authorized to modify project");
  next();
};
