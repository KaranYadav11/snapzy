import mongoose from "mongoose";
import User from "./userModel.js";
import Comment from "./commentModel.js";

const postSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

postSchema.pre("remove", async function (next) {
  try {
    // Delete comments associated with this post
    let user = await User.findById(this.author);
    if (user) {
      user.post = user.post.filter(
        (id) => id.toString() !== this._id.toString()
      );
      await user.save();
    }
    await Comment.deleteMany({ post: this._id });
    console.log("Associated comments removed");
    next();
  } catch (error) {
    next(error);
  }
});

const Post = mongoose.model("Post", postSchema);
export default Post;
