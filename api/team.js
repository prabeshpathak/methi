const { authenticateToken } = require('../controllers/auth');
const { createTeam } = require('../controllers/team');

const router = require('express').Router()

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




module.exports = router