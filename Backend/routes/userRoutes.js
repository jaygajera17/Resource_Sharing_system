

const express = require("express");
const authController = require("./../contollers/authController");
const userController = require("./../contollers/userController");

const router = express.Router();

router.route("/").get((req, res) => {
  res.status(200).json({
    message: "Hello User",
  });
});

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
router.route("/getUser").post(authController.getUser);

router.route("/forgotPassword").post(authController.forgotPassword);
router.route("/resetPassword/:token").patch(authController.resetPassword);

router
  .route("/updateMe")
  .patch(
    authController.protect,
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    userController.updateMe
  );

router
  .route("/addPost")
  .post(
    authController.protect,
    authController.uploadPostImages,
    authController.resizePostPhoto,
    authController.addPost
  );
router.route("/myPost").post(authController.protect, authController.myPost);
router.route("/Posts").post(authController.protect, authController.getPosts);
router.route("/viewPost/:id").post(authController.viewPost);

module.exports = router;