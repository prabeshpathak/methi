// importing modules
const { authenticateToken, authorizations } = require("../controllers/auth");
const {
  activeSprintIssues,
  moveCompletedSprintIssues,
} = require("../controllers/issue");
const { getProject } = require("../controllers/project");
const {
  createSprint,
  getSprints,
  updateSprint,
  getActiveSprint,
  deleteSprint,
  getSprint,
} = require("../controllers/sprint");

const router = require("express").Router();

// @route   POST api/sprint - create a sprint
router.post("/create", authenticateToken, authorizations, async (req, res) => {
  try {
    const sprint = await createSprint(req.body);
    res.send(sprint);
  } catch (error) {
    res.send(error.message);
  }
});

// @route   GET api/sprint - get all sprints belonging to a project
router.get("/project/:id", authenticateToken, async (req, res) => {
  try {
    const sprints = await getSprints(req.params.id);
    res.send(sprints);
  } catch (error) {
    res.send(error.message);
  }
});

// @route   GET api/sprint - get all active sprints and their issues
router.get("/active/:id", authenticateToken, async (req, res) => {
  try {
    const sprint = await getActiveSprint(req.params.id);
    const project = await getProject(req.params.id);
    let issues = [];
    if (sprint) issues = await activeSprintIssues(sprint._id);
    res.json({ sprint, issues, project });
  } catch (error) {
    res.send(error.message);
  }
});

// @route   GET api/sprint - get all completed sprints and their issues
router.patch("/:id", authenticateToken, authorizations, async (req, res) => {
  try {
    await updateSprint(req.params.id, req.body);
    res.send("Sprint updated");
  } catch (error) {
    res.send(error.message);
  }
});

// @route   DELETE api/sprint/:id - Complete and delete a sprint and relevant issues that are marked done
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const sprint = await getSprint(req.params.id);
    const project = await getProject(sprint.project);
    if (project.lead._id.toString() === req.user._id) {
      await deleteSprint(req.params.id);
      res.send("Sprint completed");
    } else res.status(401).send("Not authorized to modify project");
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
