import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import useGetAllMessage from "../hooks/useGetAllMessage.js";
import useGetRTM from "../hooks/useGetRTM.js";
import { Loader2, MessageCircleDashed, UserRound } from "lucide-react";

const Messages = ({ selectedUser }) => {
  useGetRTM();
  const { loading } = useGetAllMessage();
  const { messages } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.auth);

  return loading ? (
    <div className="flex-1 flex items-center justify-center overflow-y-auto p-4">
      <Loader2 color="white" className="animate-spin w-7 h-7" />
    </div>
  ) : (
    <div className="overflow-y-auto scrollbar-hide border-opacity-10 flex-1 p-4">
      {messages.length === 0 ? (
        <div className="flex h-96 w-full items-center justify-center">
          <div className="flex flex-col items-center justify-center mx-auto">
            <MessageCircleDashed className="w-40 h-40 my-4 text-white/10" />
            <span className="font-lato text-white/20 text-sm tracking-wide font-normal ">
              Say hello to begin chatting!
            </span>
          </div>
        </div>
      ) : (
        <div className="font-lato text-center mb-4 font-normal tracking-wide text-white/20 text-sm ">
          The chat’s started. Let’s keep it going!
        </div>
      )}
      <div className="flex flex-col gap-1">
        {messages &&
          messages.map((msg) => {
            return (
              <div
                key={msg._id}
                className={`flex gap-2 p-1 items-center ${
                  msg.senderId === user?._id
                    ? "justify-start flex-row-reverse"
                    : "justify-start"
                }`}
              >
                <Avatar className="w-10 h-10 ">
                  <AvatarImage
                    src={
                      msg.senderId === user?._id
                        ? user?.profilePicture
                        : selectedUser?.profilePicture
                    }
                    alt="profilePicture"
                  />
                  <AvatarFallback className="bg-white/10">
                    <UserRound size={16} color="white" />
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`px-4 py-1 h-8 rounded-full font-lato font-bold max-w-xs break-words ${
                    msg.senderId === user?._id
                      ? "bg-gradient-to-br rounded-br-lg from-purple-400 via-pink-500 to-rose-500 text-black "
                      : "bg-white opacity-95 rounded-tl-lg text-black"
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
