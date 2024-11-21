import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import {
  Bookmark,
  MessageCircle,
  MoreHorizontal,
  Send,
  Trash,
  UserRound,
} from "lucide-react";
import CommentDialog from "./CommentDialog";
import { useState } from "react";
import { Input } from "./ui/input";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setPosts, setSelectedPost } from "../redux/postSlice.js";
import { Link } from "react-router-dom";
import { setAuthUser } from "@/redux/authSlice";
import { motion } from "framer-motion";

function Post({ post }) {
  const [showHeart, setShowHeart] = useState(false);

  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [liked, setLiked] = useState(post?.likes.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post?.likes?.length);
  const [text, setText] = useState("");
  const [comment, setComment] = useState(post?.comments);
  const [open, setOpen] = useState(false);

    const debounce = (func, delay) => {
    let timerId;
    return (...args) => {
      if (timerId) clearTimeout(timerId);
      timerId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const handleDoubleClick = debounce(() => {
    if (!liked) {
      likeOrDislikeHandler(); // Like the post
    }
    setShowHeart(true); // Trigger the heart animation
    setTimeout(() => setShowHeart(false), 1000); // Hide the animation after 1 second
  }, 2000); // Adjust the delay (in milliseconds) as needed


  
  // const handleDoubleClick = () => {
  //   if (!liked) {
  //     likeOrDislikeHandler(); // Like the post
  //   }
  //   setShowHeart(true); // Trigger the heart animation
  //   setTimeout(() => setShowHeart(false), 1000); // Hide the animation after 1 second
  // };

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `https://snapzy.onrender.com/api/v1/post/${post._id}/${action}`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);
        toast.success(res.data.message);

        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatedPostData));
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `https://snapzy.onrender.com/api/v1/post/${post._id}/comment`,
        { text },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);
        const updatedPostData = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `https://snapzy.onrender.com/api/v1/post/delete/${post._id}`,
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        const updatedData = posts.filter((p) => p._id !== post?._id);
        dispatch(setPosts(updatedData));
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(
        `https://snapzy.onrender.com/api/v1/post/${post?._id}/bookmark`,
        { withCredentials: true }
      );
      if (res.data.success) {
        if (user?.bookmarks?.includes(post?._id)) {
          const updatedBookmarks = user?.bookmarks?.filter(
            (id) => id !== res.data.bookmarkId
          );
          dispatch(setAuthUser({ ...user, bookmarks: updatedBookmarks }));
        } else {
          const updatedBookmarks = [...user.bookmarks, res.data.bookmarkId];
          dispatch(setAuthUser({ ...user, bookmarks: updatedBookmarks }));
        }
      }
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  function changeEventHandler(e) {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else setText("");
  }
  let lastTap = 0;
  const handleTouch = (e) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;

    if (tapLength < 300 && tapLength > 0) {
      handleDoubleClick();
    }
    lastTap = currentTime;
  };
  return (
    <div className="my-7 w-full max-w-sm mx-auto">
      <div className="flex items-center bg-black rounded-lg mb-3 mt-8 justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="w-10 h-10">
            <AvatarImage
              src={post.author?.profilePicture}
              alt="postImage"
            ></AvatarImage>
            <AvatarFallback className="bg-black/50">
              {" "}
              <UserRound size={20} color="white" />
            </AvatarFallback>
          </Avatar>
          <Link to={`profile/${post?.author?._id}`}>
            {" "}
            <h1 className="font-semibold text-zinc-50 font-lato tracking-normal">
              {post.author?.username}
            </h1>
          </Link>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer select-none text-zinc-50 hover:text-zinc-300 " />
          </DialogTrigger>
          <DialogContent className="text-xl md:rounded-2xl rounded-2xl  text-center border-none p-4 w-[340px] h-auto bg-gradient-to-br from-purple-700 via-pink-500 to-red-400">
            <div className="flex flex-col gap-4 items-center justify-evenly">
              <Button
                onClick={bookmarkHandler}
                variant="ghost"
                className="cursor-pointer w-fit rounded-lg text-white font-extrabold font-lato"
              >
                {user?.bookmarks?.includes(post?._id)
                  ? "Remove from"
                  : "Add to"}
                {user?.bookmarks?.includes(post?._id) ? (
                  <Bookmark fill="white" />
                ) : (
                  <Bookmark className="bg-transparent" />
                )}
              </Button>
              {user && user?._id === post?.author?._id && (
                <Button
                  onClick={deletePostHandler}
                  variant="ghost"
                  className="cursor-pointer w-fit hover:bg-black hover:text-white rounded-lg text-white font-extrabold font-lato"
                >
                  <Trash />
                  Delete
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div
        className="relative rounded-2xl overflow-hidden"
        onTouchEnd={handleTouch}
        onDoubleClick={handleDoubleClick}
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={showHeart ? { scale: 1.5, opacity: 1 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute inset-0 flex justify-center items-center z-10"
        >
          <FaHeart size={100} className="text-rose-500" />
        </motion.div>
        <img
          className="rounded-2xl aspect-square object-cover w-full h-full"
          src={post?.image}
          alt="postImage"
        />
      </div>
      <div className="flex items-center justify-between mt-2 px-0.5">
        <div className="flex items-center gap-4 justify-start">
          {liked ? (
            <FaHeart
              onClick={likeOrDislikeHandler}
              size={26}
              className="text-rose-500 cursor-pointer scale-105 transform transition duration-300"
            />
          ) : (
            <FaRegHeart
              onClick={likeOrDislikeHandler}
              size={26}
              className="transition text-white hover:text-white/70 transform cursor-pointer duration-300"
            />
          )}

          <MessageCircle
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
            size={26}
            className="transition text-white hover:text-white/70 transform cursor-pointer duration-300"
          />
          <Send size={26} color="white" className="cursor-pointer" />
        </div>
        {user?.bookmarks?.includes(post?._id) ? (
          <Bookmark
            onClick={bookmarkHandler}
            size={26}
            color="white"
            fill="white"
            className="cursor-pointer"
          />
        ) : (
          <Bookmark
            onClick={bookmarkHandler}
            size={26}
            color="white"
            className="cursor-pointer"
          />
        )}
      </div>
      <span className="font-medium font-lato block pt-1 text-white ">
        {postLike > 0 ? `${postLike} likes` : ""}
      </span>
      <p className="text-white font-light text-lg font-pacifico">
        <span className="font-semibold text-[16px] font-lato mr-2 text-white">
          {post?.author?.username}
        </span>

        {post?.caption}
      </p>
      <span
        onClick={() => {
          dispatch(setSelectedPost(post));
          setOpen(true);
        }}
        className=" text-xs tracking-wide text-gray-500/60 font-semibold font-lato cursor-pointer"
      >
        {post?.comments?.length > 0
          ? `View all ${post?.comments?.length} comments`
          : "Be the first to comment"}
      </span>
      <CommentDialog open={open} setOpen={setOpen} />
      <div className="flex flex-row items-center  mt-1 justify-between">
        <Input
          type="text"
          value={text}
          onChange={changeEventHandler}
          spellCheck="false"
          placeholder="Add a comment..."
          className="outline-none underline-none placeholder:text-white/20 placeholder:font-lato placeholder:font-medium focus:outline-none focus:ring-0 text-sm w-full text-white font-bold font-lato placeholder:tracking-wider bg-transparent border-none"
          style={{
            boxShadow: "none",
            border: "none",
          }}
        />

        {text && (
          <span
            onClick={commentHandler}
            className="bg-gradient-to-br p-2 cursor-pointer tracking-wide text-sm from-purple-700 via-pink-500 to-red-400 text-transparent bg-clip-text font-bold font-lato"
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
}

export default Post;
