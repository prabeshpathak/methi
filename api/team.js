const { authenticateToken } = require('../controllers/auth');
const { canMessage } = require('../controllers/message');
const { createTeam, addToTeam, removeFromTeam, getTeams, getTeam, updateTeam, search, deleteTeam } = require('../controllers/team');

const router = require('express').Router()


// Search for user
router.get("/search/:query/:team", authenticateToken, async (req, res) => {
    try {
        res.send(await search(req.params.query, req.params.team))
    } catch (error) {
        res.send(error.message);;
    }
})

// Delete team
router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        const { lead } = await getTeam(req.params.id)
        if(req.user._id !== lead.toString())
            return res.status(401).send("Not authorized");
        
        await deleteTeam(req.params.id)
        res.send("Team deleted")
    } catch (error) {
        res.send(error.message);;
    }
})

// Create new team
router.post("/create", authenticateToken, async (req, res) => {
    try {
        const team = await createTeam({ title: req.body.title, lead: req.user._id})
        for(let i = 0; i < req.body.members.length; i++)
            await addToTeam({ team : team._id, member : req.body.members[i]._id}, req.user._id)
        res.send(team)
    } catch (error) {
        res.send(error.message);;
    }
})

// Add member
router.post("/add", authenticateToken, async (req, res) => {
    try {
        res.send(await addToTeam(req.body, req.user._id))
    } catch (error) {
        res.send(error.message);;
    }
})

// Remove member
router.post("/remove", authenticateToken, async (req, res) => {
    try {
        await removeFromTeam(req.body, req.user._id)
        res.send("Member removed")
    } catch (error) {
        res.send(error.message);;
    }
})




module.exports = router