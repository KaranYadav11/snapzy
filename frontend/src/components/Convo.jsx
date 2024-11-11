import { ArrowLeft, SendHorizontal, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import Messages from "./Messages";
import { Input } from "./ui/input";
import { useState } from "react";
import axios from "axios";
import { setMessages } from "@/redux/chatSlice";
import { Link } from "react-router-dom";

function Convo() {
  const { selectedUser } = useSelector((store) => store.auth);
  const { messages } = useSelector((store) => store.chat);
  const dispatch = useDispatch();
  const [textMessage, setTextMessage] = useState("");
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
    <div className="bg-black h-screen w-full">
      <section className="flex flex-col  py-1 px-2 h-full">
        <div className="flex bg-gradient-to-br px-4 from-purple-700 via-pink-500 to-red-400 rounded-2xl mt-1 h-20 justify-between items-center  z-10">
          <div className="flex items-center gap-3">
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
          <Link to={`/createchat`}>
            <ArrowLeft size={26} color="white" />
          </Link>
        </div>
        <div className="flex bg-black items-center justify-center">
          <hr className="w-[97%] border-2 mt-2" />
        </div>
        <Messages selectedUser={selectedUser} />
        <div className="flex  items-center p-2 mx-1 rounded-xl bg-gradient-to-br from-purple-700 via-pink-500 to-red-400">
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
