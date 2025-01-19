import {
  Heart,
  Home,
  House,
  ImagePlus,
  LogOut,
  MessageCircle,
  Search,
  TrendingUp,
  UserRound,
} from "lucide-react";

import { toast } from "sonner";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import CreatePost from "./CreatePost";
import { setAuthUser } from "@/redux/authSlice";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

function Leftsidebar() {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const path = location.pathname === "/notification" ? true : false;
  const path2 = location.pathname.startsWith("/conversation/") ? true : false;
  const isChat = location.pathname === "/chat" ? true : false;
  const { count } = useSelector((store) => store.notify);
  const { chatCount } = useSelector((store) => store.chat);

  const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
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
        navigate("/search");
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
    <>
      {/* Desktop Sidebar */}
      <div className="fixed  hidden md:block antialiased top-0 left-0 z-10 px-4 h-screen lg:w-fit">
        <div className="flex flex-col items-start justify-between">
          <h1 className="text-[44px] font-extrabold antialiased font-pacifico text-center m-6 p-4 tracking-wide bg-gradient-to-br from-purple-700 via-pink-500 to-red-400 text-transparent bg-clip-text select-none">
            Snapzy
          </h1>

          <div className="w-full">
            {sidebarItems.map((item, index) => (
              <div
                onClick={() => handleFunctions(item.text)}
                className={`flex select-none items-center gap-4 px-4 py-3 my-2 rounded-xl cursor-pointer group transition-all duration-300 ease-in-out hover:bg-gray-100 tracking-wide transform font-lato`}
                key={index}
              >
                <span className="text-gray-300 relative group-hover:scale-125 group-hover:text-black duration-300">
                  {item.icon}
                  {item.text === "Notifications" && !path2 && count > 0 && (
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
      {/* Mobile Navbar */}
      {!path2 && (
        <div className="fixed bottom-0 bg-black h-fit w-full border-t-[3px] border-white  md:hidden z-50 flex  justify-around p-1">
          <Link
            to={"/"}
            className="text-white rounded-lg bg-black w-12 h-10 flex items-center justify-center "
          >
            {" "}
            <House size={28} />
          </Link>
          <Link
            to={"/createchat"}
            className="text-white bg-black w-12 h-10 rounded-lg flex items-center justify-center "
          >
            <MessageCircle size={28} />
          </Link>
          <Link
            to={`/createpost`}
            className="text-white bg-black w-12 h-10 rounded-lg flex items-center justify-center "
          >
            {" "}
            <ImagePlus size={28} />
          </Link>
          <Link
            to={`/notification`}
            className="text-white relative  w-12 h-10 rounded-lg flex items-center justify-center "
          >
            {" "}
            <Heart size={28} />
            {!path && count > 0 && (
              <div
                size="icon"
                className={`rounded-full ${
                  count >= 0 ? "block" : "hidden"
                } flex items-center justify-center h-[19px] w-[19px] hover:bg-rose-500 bg-rose-500 absolute bottom-5 left-6`}
              >
                <span className="text-[14px] font-lato font-bold">{count}</span>
              </div>
            )}
          </Link>
          <Link
            to={`/profile/${user?._id}`}
            className="text-white bg-black w-12 h-10 rounded-lg flex items-center justify-center "
          >
            {" "}
            <Avatar className="w-8 h-8">
              <AvatarImage src={user?.profilePicture} alt="profilePicture" />
              <AvatarFallback className="bg-black/50">
                {" "}
                <UserRound size={22} color="white" />
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      )}
    </>
  );
}

export default Leftsidebar;
