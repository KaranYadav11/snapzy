import express from "express";
import * as postController from "../controllers/postController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router
  .route("/addpost")
  .post(isAuthenticated, upload.single("image"), postController.addNewPost);
router.route("/all").get(isAuthenticated, postController.getAllPost);
router.route("/userpost/all").get(isAuthenticated, postController.getUserPost);
router.route("/:id/like").get(isAuthenticated, postController.likePost);
router.route("/:id/dislike").get(isAuthenticated, postController.dislikePost);
router.route("/:id/comment").post(isAuthenticated, postController.addComment);
router
  .route("/:id/comment/all")
  .post(isAuthenticated, postController.getCommentsOfPost);
router.route("/delete/:id").delete(isAuthenticated, postController.deletePost);
router.route("/:id/bookmark").get(isAuthenticated, postController.bookmarkPost);

export default router;
