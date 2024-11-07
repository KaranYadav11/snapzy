import {
  Heart,
  Home,
  ImagePlus,
  LogOut,
  MessageCircle,
  Search,
  TrendingUp,
  UserRound,
} from "lucide-react";

import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import CreatePost from "./CreatePost";
import { setAuthUser } from "@/redux/authSlice";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { clearNotification } from "@/redux/rtnSlice";

function Leftsidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const likeNotification = useSelector(
    (store) => store.realTimeNotification?.likeNotification
  );

  const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Heart />, text: "Notifications" },
    { icon: <ImagePlus />, text: "Create" },

    { icon: <LogOut />, text: "Logout" },
  ];
  const logOut = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/v1/user/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setPosts([]));
        dispatch(setSelectedPost(null));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const createPostHandler = () => {
    setOpen(true);
  };
  const handleFunctions = (text) => {
    switch (text) {
      case "Home":
        navigate("/");
        break;
      case "Search":
        navigate("/search");
        break;
      case "Explore":
        window.alert("Explore is not implemented yet");
        break;
      case "Messages":
        navigate("/chat");
        break;

      case "Create":
        createPostHandler();
        break;

      case "Logout":
        logOut();
        break;
      default:
        break;
    }
  };
  function clear(isOpen) {
    if (!isOpen) dispatch(clearNotification());
  }
  return (
    <div className="fixed antialiased top-0 left-0 z-10 px-4 h-screen w-[16%] bg-black">
      <div className="flex flex-col items-start justify-between">
        <h1 className="text-[44px] font-extrabold antialiased font-pacifico text-center m-6 p-4 tracking-wide bg-gradient-to-br from-purple-700 via-pink-500 to-red-400 text-transparent bg-clip-text select-none">
          Snapzy
        </h1>

        <div className="w-full ">
          {sidebarItems.map((item, index) => (
            <div
              onClick={() => handleFunctions(item.text)}
              className={`flex select-none items-center gap-4 px-4 py-3 my-2 rounded-xl cursor-pointer group transition-all duration-300 ease-in-out hover:bg-gray-100 tracking-wide  transform font-lato `}
              key={index}
            >
              <span className="text-gray-300 group-hover:scale-125 group-hover:text-black duration-300">
                {item.icon}
              </span>
              <span className="text-lg font-bold font-lato text-gray-200 group-hover:text-black">
                {item.text}
              </span>
              {item.text === "Notifications" &&
                likeNotification?.length > 0 && (
                  <Popover onOpenChange={clear}>
                    <PopoverTrigger asChild>
                      <Button
                        size="icon"
                        className="rounded-full h-5 w-5  bg-rose-500 hover:bg-rose-500 absolute bottom-6 left-6"
                      >
                        {likeNotification?.length}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="bg-gradient-to-br w-fit from-purple-700 via-pink-500 to-red-500 rounded-2xl ml-4 border-none">
                      <div>
                        {likeNotification?.length === 0 ? (
                          <p className="font-lato font-normal text-black">
                            No new notification
                          </p>
                        ) : (
                          likeNotification?.map((notification) => {
                            return (
                              <div
                                key={notification?.userId}
                                className="flex items-center gap-2 my-2"
                              >
                                <Avatar>
                                  <AvatarImage
                                    src={
                                      notification?.userDetails?.profilePicture
                                    }
                                  />
                                  <AvatarFallback className="bg-white/10">
                                    <UserRound size={22} color="white" />
                                  </AvatarFallback>
                                </Avatar>
                                <p className="text-sm font-bold font-lato text-white">
                                  <span className="font-bold font-lato text-white ">
                                    {notification?.userDetails?.username}
                                  </span>{" "}
                                  liked your post
                                </p>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
            </div>
          ))}
        </div>
      </div>
      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
}

export default Leftsidebar;
