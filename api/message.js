const { authenticateToken } = require("../controllers/auth");
const { canMessage, createMessage } = require("../controllers/message");

const router = require("express").Router();

// Create message
router.post("/create", authenticateToken, async (req, res) => {
  try {
    if (await canMessage(req.body.team, req.user._id))
      res.send(await createMessage(req.body));
    else res.status(401).send("Not authorized to message");
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
