const express = require("express");
const postController = require("./../contollers/postController");

const router = express.Router();

router.route("/").get((req, res) => {
  res.status(200).json({
    message: "Hello from post roter",
    status: "success",
  });
});

// router.route("/addPost").post(postController.addPost);

module.exports = router;