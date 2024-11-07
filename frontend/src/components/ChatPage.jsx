import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { setSelectedUser } from "../redux/authSlice.js";
import { Input } from "./ui/input";

import { MessageCircleDashed, SendHorizontal, UserRound } from "lucide-react";
import Messages from "./Messages";
import axios from "axios";
import { setMessages } from "../redux/chatSlice.js";
import { Link } from "react-router-dom";
import { Badge } from "./ui/badge";

const ChatPage = () => {
  const [textMessage, setTextMessage] = useState("");
  const { user, suggestedUsers, selectedUser } = useSelector(
    (store) => store.auth
  );

  const { onlineUsers, messages } = useSelector((store) => store.chat);
  const dispatch = useDispatch();

  const sendMessageHandler = async (receiverId) => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/message/send/${receiverId}`,
        { textMessage },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]));
        setTextMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, [dispatch]);

  return (
    <div className="flex ml-[16%] h-screen">
      <section className="w-full scrollbar-hide md:w-1/4 my-2 py-2">
        <Link
          to={`/profile/${user?._id}`}
          className="flex gap-2 rounded-2xl bg-gradient-to-br  from-purple-700 via-pink-500 to-red-400  w-full px-4 py-3  items-center"
        >
          <Avatar className="w-14 h-14 ">
            <AvatarImage src={user?.profilePicture} alt="profilePicture" />
            <AvatarFallback className="bg-white/10">
              <UserRound size={22} color="white" />
            </AvatarFallback>
          </Avatar>

          <div className="relative">
            <p className="font-lato  w-36  truncate absolute tracking-wide -top-[25px] text-white text-lg font-bold">
              <Link to={`/profile/${user?._id}`}> {user?.username}</Link>
            </p>
            <Badge className="absolute text-white bg-black/70 font-lato font-bold -top-[22px] left-[158px]">
              Active
            </Badge>

            <p className="font-lato absolute h-5 overflow-hidden w-56  -top-[0px] tracking-normal text-white/90 font-medium antialiased text-xs truncate">
              {user?.bio}
            </p>
          </div>
        </Link>
        <hr className=" border-white border-2 ml-1 w-[97%] my-2" />
        <div className="overflow-y-auto bg-[#050505] rounded-2xl  scrollbar-hide flex flex-col gap-0 h-[83vh]">
          {suggestedUsers.map((suggestedUser) => {
            const isOnline = onlineUsers?.includes(suggestedUser?._id);
            return (
              <div
                key={suggestedUser?._id}
                onClick={() => dispatch(setSelectedUser(suggestedUser))}
                className="flex gap-3 group rounded-2xl text-white items-center p-3 hover:bg-white/95 cursor-pointer"
              >
                <Avatar className="w-14 h-14 group-hover:scale-110 duration-300 transform">
                  <AvatarImage
                    src={suggestedUser?.profilePicture}
                    alt="profilePicture"
                  />
                  <AvatarFallback className="bg-white/10 group-hover:bg-black/10 transform duration-300">
                    {" "}
                    <UserRound
                      size={22}
                      className="group-hover:text-black transform duration-300 text-white"
                    />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-bold font-lato text-lg duration-300 transform text-white group-hover:text-black">
                    {suggestedUser?.username}
                  </span>
                  <span
                    className={`text-xs font-lato font-bold tracking-normal ${
                      isOnline
                        ? "text-green-600"
                        : "text-slate-300/40 group-hover:text-gray-950/40"
                    } `}
                  >
                    {isOnline ? "Active" : "offline"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      {selectedUser ? (
        <section className="flex-1  flex flex-col h-full">
          <div className="flex mt-2 h-24 justify-start gap-3 items-center px-10 py-0  z-10">
            <Avatar className="w-14 h-14 ">
              <AvatarImage
                src={selectedUser?.profilePicture}
                alt="profilePicture"
              />
              <AvatarFallback className="bg-white/10">
                <UserRound size={22} color="white" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-lato font-bold text-white text-lg">
                {selectedUser?.username}
              </span>
            </div>
          </div>
          <div className="flex bg-black items-center justify-center">
            <hr className="w-[98.5%] border-2" />
          </div>
          <Messages selectedUser={selectedUser} />
          <div className="flex items-center p-2 mx-1 rounded-xl bg-gradient-to-br from-purple-700 via-pink-500 to-red-400">
            <Input
              onClick={() => sendMessageHandler(selectedUser?._id)}
              spellCheck="false"
              style={{
                boxShadow: "none",
                border: "none",
              }}
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              type="text"
              className="flex-1 placeholder:text-black/40 placeholder:font-lato font-lato text-white font-bold tracking-normal mr-2 outline-none focus-visible:ring-transparent 
              bg-black/20"
              placeholder="Type a message..."
            />
            <div
              className="bg-black p-[6px] rounded-md cursor-pointer"
              onClick={() => sendMessageHandler(selectedUser?._id)}
            >
              <SendHorizontal className="text-white" size={25} />
            </div>
          </div>
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center mx-auto">
          <MessageCircleDashed className="w-36 h-36 my-4 text-white/10" />
          <h1 className="font-medium font-lato text-lg text-white/20">
            No Chat Selected
          </h1>
          <span className="font-lato text-white/20 font-normal ">
            Open a chat to send message
          </span>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
