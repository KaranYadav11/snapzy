import express from "express";
import * as notificationController from "../controllers/notificationController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
const router = express.Router();

router.get("/", isAuthenticated, notificationController.getNotification);
router.delete("/", isAuthenticated, notificationController.deleteNotification);

export default router;
