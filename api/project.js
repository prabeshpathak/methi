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

// Create new project
router.post("/create", authenticateToken, async (req, res) => {
  try {
    const project = await createProject({ ...req.body, lead: req.user._id });
    res.send(project);
  } catch (error) {
    res.send(error.message);
  }
});

// Get projects with lead as the user
router.get("/lead", authenticateToken, async (req, res) => {
  try {
    const projects = await getLeadProjects(req.user._id);
    res.send(projects);
  } catch (error) {
    res.send(error.message);
  }
});

// Get team members relevant to user
router.get("/assignees", authenticateToken, async (req, res) => {
  try {
    res.send(await getTeamAssignees(req.user._id));
  } catch (error) {
    res.send(error.message);
  }
});

// Get project
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    res.send(await getProject(req.params.id));
  } catch (error) {
    res.send(error.message);
  }
});

// Get all projects relevant to user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const projects = await getProjects(req.user._id);
    res.send(projects);
  } catch (error) {
    res.send(error.message);
  }
});

// Update project
router.patch("/:id", authenticateToken, async (req, res) => {
  try {
    if (await isProjectLead(req.params.id, req.user._id))
      res.send(await updateProject(req.params.id, req.body));
    else res.status(401).send("Not authorized");
  } catch (error) {
    res.send(error.message);
  }
});

// Delete project
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
