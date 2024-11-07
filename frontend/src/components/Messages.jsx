import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetAllMessage from "../hooks/useGetAllMessage.js";
import useGetRTM from "../hooks/useGetRTM.js";
import { UserRound } from "lucide-react";

const Messages = ({ selectedUser }) => {
  useGetRTM();
  useGetAllMessage();
  const { messages } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.auth);
  return (
    <div className="overflow-y-auto  border-opacity-10  flex-1 p-4">
      <div className="flex  justify-center">
        <div className="flex flex-col p-1 items-center  justify-center">
          <Avatar className="w-14 h-14 ">
            <AvatarImage
              src={selectedUser?.profilePicture}
              alt="profilePicture"
            />
            <AvatarFallback className="bg-white/10">
              <UserRound size={22} color="white" />
            </AvatarFallback>
          </Avatar>
          <span className="font-lato font-bold text-lg text-white">
            {selectedUser?.username}
          </span>
          <Link to={`/profile/${selectedUser?._id}`}>
            <Button
              className="h-8 my-2 rounded-full text-black hover:bg-white/90 bg-white font-lato font-bold"
              variant="ghost"
            >
              View Profile
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex  flex-col gap-3">
        {messages &&
          messages.map((msg) => {
            return (
              <div
                key={msg._id}
                className={`flex px-2 ${
                  msg.senderId === user?._id ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-1.5 rounded-full font-lato font-bold max-w-xs break-words ${
                    msg.senderId === user?._id
                      ? "bg-gradient-to-br from-purple-400 via-pink-500 to-rose-500 text-black "
                      : "bg-white opacity-95 text-black"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Messages;
