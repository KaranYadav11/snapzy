import Notification from "../models/notificationModel.js";

export const getNotification = async (req, res) => {
  try {
    const notification = await Notification.find({ to: req.id })
      .populate({
        path: "from",
        select: "username profilePicture",
      })
      .sort({ createdAt: -1 });

    await Notification.updateMany({ to: req.id }, { read: true });
    res.status(200).json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    await Notification.deleteMany({ to: req.id });
    res
      .status(200)
      .json({ success: true, message: "All Notifications Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
