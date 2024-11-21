import express from "express";
import upload from "../middlewares/multer.js";
import * as userController from "../controllers/userController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/register").post(userController.register);
router.route("/login").post(userController.login);
router.route("/logout").get(userController.logout);
router.route("/:id/profile").get(isAuthenticated, userController.getProfile);
router
  .route("/profile/edit")
  .post(
    isAuthenticated,
    upload.single("profilePhoto"),
    userController.editProfile
  );

router
  .route("/suggested")
  .get(isAuthenticated, userController.getSuggestedUsers);

router
  .route("/followorunfollow/:id")
  .post(isAuthenticated, userController.followOrUnfollow);

export default router;
