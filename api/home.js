// importing the modules
const router = require("express").Router();

// @route   GET api/home
router.get("/", (req, res) => {
  try {
    res.send("Cool People see this page!!");
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
