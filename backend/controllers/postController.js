import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import Comment from "../models/commentModel.js";
import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import Notification from "../models/notificationModel.js";
export const getAllPost = async (req, res) => {
  try {
    const allPosts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username profilePicture" },
      });
    return res.status(200).json({
      success: true,
      allPosts,
      message: "All Posts",
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;
    if (!image) return res.status(400).json({ message: "Image is required" });
    const optimizedImage = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    // buffer to data URI

    const fileUri = `data:image/jpeg;base64,${optimizedImage.toString(
      "base64"
    )}`;
    let cloudResponse;
    try {
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    } catch (cloudError) {
      console.error(`Cloudinary Error: ${cloudError.message}`);
      return res
        .status(500)
        .json({ success: false, message: "Image upload failed" });
    }
    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });

    const user = await User.findById(req.id);
    if (user) {
      user.post.push(post._id);
      await user.save();
    }
    await post.populate({ path: "author", select: "-password" });
    return res
      .status(201)
      .json({ success: true, message: "New Post Added", post });
  } catch (error) {
    console.error(`Error 💩: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getUserPost = async (req, res) => {
  try {
    const userId = req.id;
    const userPosts = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username profilePicture" },
      });

    return res.status(200).json({
      success: true,
      userPosts,
      message: "All User Posts",
    });
  } catch (error) {
    console.error(`Error 💩: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const likePost = async (req, res) => {
  try {
    const userLikingPost = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });

    await post.updateOne({ $addToSet: { likes: userLikingPost } });
    await post.save(); //optional
    const user = await User.findById(userLikingPost).select(
      "username profilePicture"
    );
    const postOwnerId = post.author.toString();

    // if (postOwnerId !== userLikingPost) {
    //   const notification = {
    //     userDetails: user,
    //     userId: userLikingPost,
    //     type: "like",
    //     postId,
    //     message: `${user.username} liked your post`,
    //   };
    //   const postOwnerSocketId = getReceiverSocketId(postOwnerId);
    //   io.to(postOwnerSocketId).emit("notification", notification);
    // }

    if (userLikingPost !== postOwnerId) {
      const notification = new Notification({
        from: userLikingPost,
        to: postOwnerId,
        postId,
        type: "like",
      });
      await notification.save();

      // Populate 'from' field with username and profilePicture
      const populatedNotification = await Notification.findById(
        notification._id
      ).populate({
        path: "from", // Refers to the 'from' field in the Notification schema
        select: "username profilePicture", // Only fetch these fields
      });

      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      io.to(postOwnerSocketId).emit("notification", populatedNotification);
    }

    return res.status(200).json({ success: true, message: "Post Liked ❤️" });
  } catch (error) {
    console.error(`Error 💩: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
export const dislikePost = async (req, res) => {
  try {
    const userLikingPost = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });

    await post.updateOne({ $pull: { likes: userLikingPost } });
    await post.save(); //optional
    const user = await User.findById(userLikingPost).select(
      "username profilePicture"
    );
    const postOwnerId = post.author.toString();
    if (postOwnerId !== userLikingPost) {
      // Remove the like notification
      await Notification.findOneAndDelete({
        from: userLikingPost,
        to: postOwnerId,
        type: "like",
      });
    }

    if (postOwnerId !== userLikingPost) {
      const notification = {
        type: "dislike",
        postId,
      };
      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      io.to(postOwnerSocketId).emit("notification", notification);
    }
    return res.status(200).json({ success: true, message: "Post Disliked 🥲" });
  } catch (error) {
    console.error(`Error 💩: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const userCommetingThePost = req.id;

    const { text } = req.body;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found 🥲" });

    const comment = await Comment.create({
      text,
      author: userCommetingThePost,
      post: postId,
    });

    await comment.populate({
      path: "author",
      select: "username profilePicture",
    });

    post.comments.push(comment._id);
    await post.save();
    return res.status(201).json({
      success: true,
      message: "Comment Successfully Posted 😊",
      comment,
    });
  } catch (error) {
    console.error(`Error 💩: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server Error 💩" });
  }
};

export const getCommentsOfPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await Comment.find({ post: postId }).populate({
      path: "author",
      select: "username profilePicture",
    });
    if (!comments)
      return res
        .status(404)
        .json({ success: false, message: "No comments found" });
    return res
      .status(200)
      .json({ success: true, comments, message: "All Comments for the Post" });
  } catch (error) {
    console.error(`Error 💩: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findOne({ _id: postId, author: authorId });
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    // pre-remove hook will take care of deleting comments and removing post from user's post array
    await post.deleteOne();
    return res.status(200).json({ success: true, message: "Post Deleted 🥲" });
  } catch (error) {
    console.error(`Error 💩: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const bookmarkPost = async (req, res) => {
  try {
    const userId = req.id;
    const postId = req.params.id;
    // check if the post exists
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    // check if the user exists
    const user = await User.findById(userId).select("bookmarks");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    // logic to add or remove post from bookmarks
    const isBookmarked = user.bookmarks.includes(post?._id);
    const update = isBookmarked
      ? { $pull: { bookmarks: post._id } }
      : { $addToSet: { bookmarks: post._id } };

    await User.findByIdAndUpdate(userId, update);
    return res.status(200).json({
      success: true,
      bookmarkId: post._id,
      message: isBookmarked ? "Removed from Saved" : "Added to Saved",
    });
  } catch (error) {
    console.error(`Error 💩: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
