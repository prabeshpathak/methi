const router = require("express").Router();

router.get("/", (req, res) => {
  try {
    res.send("Cool People see this page!!");
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
