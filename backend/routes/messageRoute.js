import express from "express";

import * as messageController from "../controllers/messageController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/send/:id").post(isAuthenticated, messageController.sendMessage);
router.route("/all/:id").get(isAuthenticated, messageController.getMessage);

export default router;
