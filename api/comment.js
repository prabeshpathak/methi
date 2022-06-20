// Importing the modules
const { authenticateToken } = require("../controllers/auth");
const {
  createComment,
  canComment,
  getComments,
  updateComment,
  hasDeletePermission,
  deleteComment,
} = require("../controllers/comment");
const router = require("express").Router();

// @route   GET api/comment - get all comments
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    // sending the response to the client
    res.send(await getComments(req.params.id));
  } catch (error) {
    res.send(error.message);
  }
});

// @route   POST api/comment - create a comment
router.post("/create", authenticateToken, async (req, res) => {
  try {
    // validating the comment author and sending the response to the client
    if (await canComment(req.body.issue, req.user._id))
      res.send(await createComment(req.body));
    else res.status(401).send("Not authorized to comment");
  } catch (error) {
    res.send(error.message);
  }
});

// @route   PUT api/comment - update a comment
router.patch("/:id", authenticateToken, async (req, res) => {
  try {
    if (await canComment(req.body.issue, req.user._id))
      await updateComment(req.params.id, req.body);
    else return res.status(401).send("Not authorized to comment");
    res.send("Comment updated");
  } catch (error) {
    res.send(error.message);
  }
});

// @route   DELETE api/comment - delete a comment
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    // authorizing the user to delete the comment
    if (await hasDeletePermission(req.params.id, req.user._id))
      await deleteComment(req.params.id);
    else return res.status(401).send("Not authorized to delete comment");
    res.send("Comment deleted");
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
