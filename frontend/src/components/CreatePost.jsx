import { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { readFileAsURL } from "@/lib/utils";
import { Loader2, Image, UserRound } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../redux/postSlice.js"; // Adjust the path as necessary
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
function CreatePost({ open, setOpen }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { posts } = useSelector((store) => store.post);
  const { user } = useSelector((store) => store.auth);
  const imageRef = useRef(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileChangeHandler = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsURL(file);
      setImagePreview(dataUrl);
    }
  };
  const createPostHandler = async () => {
    const formData = new FormData();
    formData.append("caption", caption);
    if (imagePreview) formData.append("image", file);
    try {
      setLoading(true);
      const res = await axios.post(
        "https://snapzy.onrender.com/api/v1/post/addpost",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);

        setOpen(false);
        setCaption("");
        setFile(null);
        setImagePreview(null);
        dispatch(setPosts([res.data.post, ...posts]));
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
      navigate("/");
    }
  };

  return (
    <div>
      <Dialog open={open}>
        <DialogContent
          onInteractOutside={() => setOpen(false)}
          className="w-full h-full md:h-fit flex overflow-scroll scrollbar-hide overflow-x-hidden flex-col gap-4 items-center text-xl text-center border-none md:w-[410px] md:max-h-screen bg-gradient-to-br from-purple-700 via-pink-500 to-red-400 "
        >
          <DialogHeader className="font-lato mt-3  font-extrabold text-center text-2xl text-white">
            <DialogTitle className="text-3xl antialiased tracking-normal mt-1">
              Create a new post
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="font-lato text-gray-100 tracking-wide font-light p-2 text-xs">
            Simply select an image, write your caption, and hit
            &quot;Post&quot;.
          </DialogDescription>
          <hr className="border-t-2 w-[97%]" />
          <div className="flex flex-row items-center w-full ml-8 justify-start">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={user?.profilePicture} alt="image" />
                <AvatarFallback className="bg-black/50">
                  {" "}
                  <UserRound size={20} color="white" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-red-400 relative w-60">
                <h1 className="text-sm absolute -top-[18px] antialiased font-extrabold text-gray-100 font-lato tracking-wider ">
                  {user?.username ? user?.username : ""}
                </h1>
                <span className="text-xs absolute -top-0 -left-0 text-gray-100 font-lato font-medium tracking-wide">
                  {user?.bio}
                </span>
              </div>
            </div>
          </div>
          <Textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            style={{
              boxShadow: "none",
              border: "none",
            }}
            spellCheck="false"
            className="focus-visible:ring-transparent mt-1 placeholder:font-lato placeholder:font-light placeholder:text-gray-300 placeholder:tracking-wide font-lato text-white border-none bg-black/60 w-[97%] p-2 rounded-xl"
            placeholder="Write a caption..."
          />
          {imagePreview && (
            <div className="w-full h-full justify-center items-center flex mt-4">
              <img
                src={imagePreview}
                alt="preview"
                className="p-2  rounded-2xl"
              />
            </div>
          )}
          <input
            ref={imageRef}
            type="file"
            className="hidden"
            onChange={fileChangeHandler}
          />
          <Button
            onClick={() => imageRef.current.click()}
            className="w-fit my-6 mx-auto rounded-full hover:bg-black/60 bg-black text-white font-lato font-bold  tracking-wide"
          >
            <Image className="h-6 w-6 " />
            Select Image
          </Button>
          {imagePreview && (
            <Button
              onClick={createPostHandler}
              disabled={loading}
              type="submit"
              className="w-[97%] rounded-full mb-10 mx-auto hover:bg-black/60 bg-black text-white font-lato font-bold"
            >
              {loading ? (
                <Loader2 className="animate-spin h-6 w-6 mr-2" />
              ) : (
                "Post"
              )}
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreatePost;
