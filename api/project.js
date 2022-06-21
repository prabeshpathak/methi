// importing modules
const { authenticateToken } = require("../controllers/auth");
const {
  createProject,
  getProjects,
  getLeadProjects,
  getProject,
  updateProject,
  deleteProject,
  isProjectLead,
} = require("../controllers/project");
const { getTeamAssignees } = require("../controllers/team");

const router = require("express").Router();

// @route   POST api/project - create a project
router.post("/create", authenticateToken, async (req, res) => {
  try {
    const project = await createProject({ ...req.body, lead: req.user._id });
    res.send(project);
  } catch (error) {
    res.send(error.message);
  }
});

// @route   GET api/project - get all projects with the user as a lead
router.get("/lead", authenticateToken, async (req, res) => {
  try {
    const projects = await getLeadProjects(req.user._id);
    res.send(projects);
  } catch (error) {
    res.send(error.message);
  }
});

// @route   GET api/project/assignees - get all members related to a project as assignees
router.get("/assignees", authenticateToken, async (req, res) => {
  try {
    res.send(await getTeamAssignees(req.user._id));
  } catch (error) {
    res.send(error.message);
  }
});

// @route   GET api/project - get all projects
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    res.send(await getProject(req.params.id));
  } catch (error) {
    res.send(error.message);
  }
});

// @route   GET api/project - get all projects related to a user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const projects = await getProjects(req.user._id);
    res.send(projects);
  } catch (error) {
    res.send(error.message);
  }
});

// @route  PUT api/project - update a project
router.patch("/:id", authenticateToken, async (req, res) => {
  try {
    if (await isProjectLead(req.params.id, req.user._id))
      res.send(await updateProject(req.params.id, req.body));
    else res.status(401).send("Not authorized");
  } catch (error) {
    res.send(error.message);
  }
});

// @route   DELETE api/project - delete a project
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    if (await isProjectLead(req.params.id, req.user._id)) {
      await deleteProject(req.params.id);
      res.send("Project deleted");
    } else res.status(401).send("Not authorized");
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
