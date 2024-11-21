import {
  Heart,
  Home,
  ImagePlus,
  LogOut,
  MessageCircle,
  Search,
  TrendingUp,
} from "lucide-react";

import { toast } from "sonner";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import CreatePost from "./CreatePost";
import { setAuthUser } from "@/redux/authSlice";
import { setPosts, setSelectedPost } from "@/redux/postSlice";

function Leftsidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const path = location.pathname === "/notification" ? true : false;
  const isChat = location.pathname === "/chat" ? true : false;
  const { count } = useSelector((store) => store.notify);
  const { chatCount } = useSelector((store) => store.chat);

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
      const res = await axios.get(
        `https://snapzy.onrender.com/api/v1/user/logout`,
        {
          withCredentials: true,
        }
      );
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
        window.alert("Search is not implemented yet");
        break;
      case "Explore":
        window.alert("Explore is not implemented yet");
        break;
      case "Messages":
        navigate("/chat");
        break;
      case "Notifications":
        navigate("/notification");
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

  return (
    <div className="fixed bg-black hidden md:block antialiased top-0 left-0 z-10 px-4 h-screen w-[16%]">
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
              <span className="text-gray-300 relative group-hover:scale-125 group-hover:text-black duration-300">
                {item.icon}
                {item.text === "Notifications" && !path && count > 0 && (
                  <div
                    className={`rounded-full ${
                      count >= 0 ? "block" : "hidden"
                    } absolute bg-red-500 text-white font-lato font-bold h-[19px] w-[19px] -top-[7px] -right-2 flex items-center justify-center`}
                  >
                    <span className="mx-auto font-bold font-lato text-center text-[15px]">
                      {count}
                    </span>
                  </div>
                )}
                {item.text === "Messages" && !isChat && chatCount > 0 && (
                  <div
                    className={`rounded-full ${
                      count >= 0 ? "block" : "hidden"
                    } absolute bg-red-500 text-white font-lato font-bold h-[19px] w-[19px] -top-[7px] -right-2 flex items-center justify-center`}
                  >
                    <span className="mx-auto font-bold font-lato text-center text-[15px]">
                      {chatCount}
                    </span>
                  </div>
                )}
              </span>

              <span className="text-lg font-bold font-lato text-gray-200 group-hover:text-black">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
}

export default Leftsidebar;
