const {
  registerUser,
  generateAccessToken,
  login,
} = require("../controllers/auth.controller");

const router = require("express").Router();

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

// Register Login user
router.post("/login", async (req, res) => {
  try {
    const token = await login(req.body);
    if (token) return res.send(token);
    res.status(401).send("Email or password doesn't match");
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
