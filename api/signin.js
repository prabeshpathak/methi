// importing modules
const {
  registerUser,
  generateAccessToken,
  authenticateToken,
  login,
  updateUser,
  getUser,
  googleLogin,
} = require("../controllers/auth");

const router = require("express").Router();

// @route   GET api/user - get the user
router.get("/user", authenticateToken, async (req, res) => {
  try {
    res.send(await getUser(req.user._id));
  } catch (error) {
    res.send(error.message);
  }
});

// @route   PUT api/user - update the user
router.patch("/user", authenticateToken, async (req, res) => {
  try {
    await updateUser(req.user._id, req.body);
    res.send("Profile updated");
  } catch (error) {
    if (error.code === 11000)
      return res.status(409).send("Email already exists");
    res.send(error.message);
  }
});

// @route   POST api/auth/register - register a new user
router.post("/register", async (req, res) => {
  try {
    const user = await registerUser(req.body);
    const token = generateAccessToken(user);
    res.status(201).send({ token, user });
  } catch (error) {
    if (error.code === 11000)
      return res.status(409).send("Email already exists");
    res.send(error.message);
  }
});

// @route   POST api/auth/login - login a user
router.post("/login", async (req, res) => {
  try {
    const token = await login(req.body);
    if (token) return res.send(token);
    res.status(401).send("Email or password doesn't match");
  } catch (error) {
    res.send(error.message);
  }
});

router.post("/googleLogin", googleLogin);

module.exports = router;
