import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogOverlay } from "./ui/dialog";
import {
  MoreHorizontal,
  SendHorizontal,
  SendHorizontalIcon,
  Trash,
  UserRound,
  UserRoundX,
} from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import axios from "axios";
import { toast } from "sonner";
import { setPosts } from "../redux/postSlice.js";

// eslint-disable-next-line react/prop-types
function CommentDialog({ open, setOpen }) {
  const dispatch = useDispatch();
  const { selectedPost, posts } = useSelector((store) => store.post);
  const [comment, setComment] = useState(selectedPost?.comments);
  const [text, setText] = useState("");

  function changeEventHandler(e) {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else setText("");
  }
  //
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [comment]); // This will run every time `comments` updates
  //

  useEffect(() => {
    setComment(selectedPost?.comments);
  }, [selectedPost]);

  const postHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${selectedPost._id}/comment`,
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
          p._id === selectedPost._id
            ? { ...p, comments: updatedCommentData }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <Dialog open={open}>
      <DialogOverlay>
        <DialogContent
          className="border-none ring-0 focus:ring-0 outline-none h-[450px] w-[370px] 
          rounded-2xl focus:outline-none bg-gradient-to-br from-purple-700 via-pink-500 to-red-400 md:w-[800px] md:h-[390px]"
          onInteractOutside={() => setOpen(false)}
        >
          <div className="flex flex-row gap-0">
            <div className="w-1/2  hidden md:block">
              <img
                className="rounded-l-lg object-cover aspect-square w-full h-[390px] "
                src={selectedPost?.image}
                alt="postImage"
              />
            </div>
            <div className="flex flex-col justify-between w-full md:w-1/2">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center ml-3 gap-2 my-2">
                  <Link>
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={selectedPost?.author?.profilePicture}
                        alt="avatar"
                      />
                      <AvatarFallback className="bg-white/10">
                        <UserRound size={22} color="white" />
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <Link className="font-bold tracking-wider font-lato text-white text-sm">
                    {selectedPost?.author?.username}
                  </Link>
                </div>
              </div>
              <hr className="border-t-[3px] md:hidden mx-2" />
              <div
                ref={containerRef}
                className="flex-1 text-xl flex flex-col gap-3 bg-black/40 rounded-xl font-lato text-white overflow-y-auto max-h-[290px] my-0.5 mx-1 scrollbar-hide p-4"
              >
                {comment?.length === 0 ? (
                  <p className="text-2xl text-white/60 font-normal font-lato mt-14 text-center">
                    No comments yet !
                  </p>
                ) : (
                  comment?.map((comment) => (
                    <Comment key={comment._id} comment={comment} />
                  ))
                )}
              </div>
              <div>
                <div className="flex items-center ">
                  <Input
                    type="text"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        if (text.trim()) {
                          postHandler();
                        }
                      }
                    }}
                    value={text}
                    onChange={changeEventHandler}
                    spellCheck="false"
                    placeholder="Add a comment..."
                    className="outline-none  underline-none placeholder:text-white/50 placeholder:font-lato placeholder:font-normal focus:outline-none focus:ring-0 text-sm w-full text-white font-medium font-lato placeholder:tracking-wider bg-black/50 mb-4 md:mb-0.5 mx-1 border-none"
                    style={{
                      boxShadow: "none",
                      border: "none",
                    }}
                  />
                  {text && (
                    <div className="bg-black rounded-lg mr-1">
                      {/* <Button
                        onClick={postHandler}
                        className="bg-gradient-to-br tracking-wide text-sm from-purple-700 via-pink-500 to-red-400 bg-black text-transparent bg-clip-text font-bold font-lato p-2"
                      > */}
                      <SendHorizontalIcon
                        onClick={postHandler}
                        size={34}
                        className=" text-white p-1 cursor-pointer"
                      />
                      {/* </Button> */}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
}

export default CommentDialog;
