import { ArrowLeft, SendHorizontal, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import Messages from "./Messages";
import { Input } from "./ui/input";
import { useState } from "react";
import axios from "axios";
import { setMessages } from "@/redux/chatSlice";
import { Link } from "react-router-dom";
import { Badge } from "./ui/badge";

function Convo() {
  const { onlineUsers } = useSelector((store) => store.chat);
  const { selectedUser } = useSelector((store) => store.auth);
  const { messages } = useSelector((store) => store.chat);
  const dispatch = useDispatch();
  const [textMessage, setTextMessage] = useState("");
  const isOnline = onlineUsers?.includes(selectedUser?._id);
  const sendMessageHandler = async (receiverId) => {
    try {
      const res = await axios.post(
        `https://snapzy.onrender.com/api/v1/message/send/${receiverId}`,
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
  return (
    <div className="bg-black  h-screen w-full">
      <section className="flex flex-col  py-1 px-2 h-full">
        <div className="flex bg-gradient-to-br px-4 from-purple-700 via-pink-500 to-red-400 rounded-2xl mt-1 h-20 justify-between items-center  z-10">
          <div className="flex items-center gap-3">
            <Avatar className="w-14 h-14 ">
              <Link to={`/profile/${selectedUser?._id}`}>
                <AvatarImage
                  src={selectedUser?.profilePicture}
                  alt="profilePicture"
                />
              </Link>
              <AvatarFallback className="bg-white/10">
                <Link to={`/profile/${selectedUser?._id}`}>
                  <UserRound size={22} color="white" />
                </Link>
              </AvatarFallback>
            </Avatar>
            <div
              className="font-lato font-bold max-w-32 truncate text-white text-lg"
              to={`/profile/${selectedUser?._id}`}
            >
              <Link to={`/profile/${selectedUser?._id}`}>
                {" "}
                {selectedUser?.username}
              </Link>
            </div>
            <Badge
              className={`text-xs font-lato font-bold bg-black/70 tracking-normal ${
                isOnline ? "text-emerald-400" : "text-gray-50/50 "
              } `}
            >
              {isOnline ? "Active" : "Offline"}
            </Badge>
          </div>
          <Link to={`/createchat`}>
            <ArrowLeft size={26} color="white" />
          </Link>
        </div>

        <hr className=" border-white border-2 ml-1 w-[97%] my-2" />
        <Messages selectedUser={selectedUser} />
        <div className="flex  items-center p-2 md:mx-1 rounded-xl bg-gradient-to-br from-purple-700 via-pink-500 to-red-400">
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
    </div>
  );
}

export default Convo;
