const { authenticateToken } = require('../controllers/auth');
const { createComment, canComment, getComments, updateComment, hasDeletePermission, deleteComment } = require('../controllers/comment');

const router = require('express').Router()

// Get comments
router.get("/:id", authenticateToken, async (req, res) => {
    try {
        res.send(await getComments(req.params.id))
    } catch (error) {
        res.send(error.message);;
    }
})

// Create comment
router.post("/create", authenticateToken, async (req, res) => {
    try {
        if(await canComment(req.body.issue, req.user._id))
            res.send(await createComment(req.body))
        else 
            res.status(401).send("Not authorized to comment");
    } catch (error) {
        res.send(error.message);;
    }
})

// Update comment
router.patch("/:id", authenticateToken, async (req, res) => {
    try {
        if(await canComment(req.body.issue, req.user._id))
            await updateComment(req.params.id, req.body)
        else 
            return res.status(401).send("Not authorized to comment");
        res.send("Comment updated")
    } catch (error) {
        res.send(error.message);;
    }
})

// Delete comment
router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        if(await hasDeletePermission(req.params.id, req.user._id))
            await deleteComment(req.params.id)
        else 
            return res.status(401).send("Not authorized to delete comment");
        res.send("Comment deleted")
    } catch (error) {
        res.send(error.message);;
    }
})

module.exports = router