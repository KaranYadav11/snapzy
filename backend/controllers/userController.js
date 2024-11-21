import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";
import Post from "../models/postModel.js";
import Notification from "../models/notificationModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill in all fields" });
    }
    const user1 = await User.findOne({ username });
    if (user1) {
      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this E-mail",
      });
    }
    const hashPass = await bcrypt.hash(password, 10);
    await User.create({
      username,
      email,
      password: hashPass,
    });

    return res
      .status(201)
      .json({ success: true, message: "Account Created Successfully" });
  } catch (error) {
    console.error(`Error 💩: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server Error !" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill in all fields" });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    const posts = await Post.find({
      _id: { $in: user.post },
      author: user._id,
    });

    const populatePosts = posts.length ? posts : [];

    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: populatePosts,
      bookmarks: user.bookmarks,
    };

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 1,
      })
      .status(200)
      .json({
        success: true,
        message: `Welcome Back, ${user.username}`,
        user,
      });
  } catch (error) {
    console.error(`Error 💩: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const logout = async (_, res) => {
  try {
    return res
      .cookie("token", "", {
        maxAge: 0,
        path: "/",
      })
      .json({
        success: true,
        message: "Logged out successfully",
      });
  } catch (error) {
    console.error(`Error 💩: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate({ path: "post", createdAt: -1 })
      .populate("bookmarks")
      .select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(`Error 💩: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    const profilePicture = req.file;
    let cloudResponse;
    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;
    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "Profile Updated ✅", user });
  } catch (error) {
    console.error(`Error 💩: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select(
      "-password"
    );
    if (!suggestedUsers) {
      return res.status(400).json({
        message: "Currently do not have any users",
      });
    }
    return res.status(200).json({
      success: true,
      users: suggestedUsers,
    });
  } catch (error) {
    console.log(error);
  }
};
export const followOrUnfollow = async (req, res) => {
  try {
    const followKrneWala = req.id;
    const jiskoFollowKrunga = req.params.id;
    if (followKrneWala.toString() === jiskoFollowKrunga) {
      return res.status(400).json({
        message: "You cannot follow/unfollow yourself",
        success: false,
      });
    }

    const user = await User.findById(followKrneWala);
    const targetUser = await User.findById(jiskoFollowKrunga);

    if (!user || !targetUser) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    const isFollowing = user.following.includes(jiskoFollowKrunga);
    if (isFollowing) {
      await Promise.all([
        User.updateOne(
          { _id: followKrneWala },
          { $pull: { following: jiskoFollowKrunga } }
        ),
        User.updateOne(
          { _id: jiskoFollowKrunga },
          { $pull: { followers: followKrneWala } }
        ),
        Notification.deleteOne({
          from: followKrneWala,
          to: jiskoFollowKrunga,
          type: "follow",
        }),
      ]);

      if (followKrneWala !== jiskoFollowKrunga) {
        const notification = {
          type: "unfollow",
          postId: followKrneWala,
        };
        const postOwnerSocketId = getReceiverSocketId(jiskoFollowKrunga);
        io.to(postOwnerSocketId).emit("notification", notification);

        return res.status(200).json({
          message: `Unfollowed ${targetUser.username}`,
          success: true,
        });
      }
    } else {
      await Promise.all([
        User.updateOne(
          { _id: followKrneWala },
          { $push: { following: jiskoFollowKrunga } }
        ),
        User.updateOne(
          { _id: jiskoFollowKrunga },
          { $push: { followers: followKrneWala } }
        ),
      ]);

      const newNotification = new Notification({
        from: followKrneWala,
        to: jiskoFollowKrunga,
        type: "follow",
        postId: followKrneWala,
      });
      await newNotification.save();

      const populatedNotification = await Notification.findById(
        newNotification._id
      ).populate({
        path: "from",
        select: "username profilePicture",
      });

      const postOwnerSocketId = getReceiverSocketId(jiskoFollowKrunga);
      io.to(postOwnerSocketId).emit("notification", populatedNotification);
      return res
        .status(200)
        .json({ message: `Followed ${targetUser.username}`, success: true });
    }
  } catch (error) {
    console.log(error);
  }
};
