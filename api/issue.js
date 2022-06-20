// importing modules
const { authenticateToken, authorizations } = require("../controllers/auth");
const { canComment, getComments } = require("../controllers/comment");
const {
  createIssue,
  getIssues,
  updateIssue,
  backlogIssues,
  getIssue,
  epicIssues,
  deleteIssue,
  getRoadmap,
} = require("../controllers/issue");
const { getSprints } = require("../controllers/sprint");
const { getTeamAssignees } = require("../controllers/team");

const router = require("express").Router();

// @route   POST api/issue - create issues
router.post("/create", authenticateToken, authorizations, async (req, res) => {
  try {
    // passing the request body to the controller
    const issue = await createIssue(req.body);
    res.send(issue);
  } catch (error) {
    res.send(error.message);
  }
});

// @route   GET api/issue - get all backlog issues
router.get("/backlog/:id", authenticateToken, async (req, res) => {
  try {
    // sending the issues response to the client
    const issues = await backlogIssues(req.params.id);
    res.send(issues);
  } catch (error) {
    res.send(error.message);
  }
});

// @route   GET api/roadmap - get all epic of projects
router.get("/roadmap/:id", authenticateToken, async (req, res) => {
  try {
    // sending the roadmap response to the client
    const issues = await getRoadmap(req.params.id);
    res.send(issues);
  } catch (error) {
    res.send(error.message);
  }
});

// @route   GET api/issue - get issue details
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    //  getting the issue details
    const issue = await getIssue(req.params.id);
    // augmenting the issue with the other data
    if (!issue) return res.status(404).send("Issue not found");
    const epics = await epicIssues(issue.project);
    const sprints = await getSprints(issue.project._id);
    const assignees = await getTeamAssignees(issue.project.lead);
    const comments = await getComments(req.params.id);
    // authorizing the user to comment on the issue
    const commentPermission = (await canComment(req.params.id, req.user._id))
      ? true
      : false;
    res.send({ issue, epics, sprints, assignees, comments, commentPermission });
  } catch (error) {
    res.send(error.message);
  }
});

// @route   PATCH api/issue - update issue
router.patch("/:id", authenticateToken, authorizations, async (req, res) => {
  try {
    await updateIssue(req.params.id, req.body);
    res.send("Issue updated");
  } catch (error) {
    res.send(error.message);
  }
});

// @route   PATCH api/issue - update issue status
router.patch("/status/:id", authenticateToken, async (req, res) => {
  try {
    await updateIssue(req.params.id, { issueStatus: req.body.issueStatus });
    res.send("Issue updated");
  } catch (error) {
    res.send(error.message);
  }
});

// @route   DELETE api/issue - delete issue
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    if (await deleteIssue(req.params.id, req.user._id))
      res.send("Issue deleted");
    else res.status(401).send("Not authorized");
  } catch (error) {
    res.send(error.message);
  }
});

// @route   GET api/issue - get all issues assigned to user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const issues = await getIssues(req.user._id);
    res.send(issues);
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
