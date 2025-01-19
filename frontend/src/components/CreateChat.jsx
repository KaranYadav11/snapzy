import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { UserRound } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Badge } from "./ui/badge";
import { setSelectedUser } from "@/redux/authSlice";

function CreateChat() {
  const { user, suggestedUsers } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const { onlineUsers } = useSelector((store) => store.chat);
  return (
    <div className="relative h-screen md:pl-[16%]">
      <section className="w-full fixed md:max-w-fit scrollbar-hide px-2 py-2">
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
            <p className="font-lato absolute h-5 overflow-hidden w-56  -top-[0px] tracking-normal text-white/90 font-medium antialiased text-xs truncate">
              {user?.bio}
            </p>
          </div>
        </Link>
        <hr className=" border-white border-2 ml-1 w-[97%] my-2" />
        <div className="overflow-y-auto bg-black  rounded-2xl  scrollbar-hide flex flex-col gap-0 h-[75vh]">
          {suggestedUsers.map((suggestedUser) => {
            const isOnline = onlineUsers?.includes(suggestedUser?._id);
            return (
              <Link
                to={`/conversation/${suggestedUser?._id}`}
                key={suggestedUser?._id}
                onClick={() => dispatch(setSelectedUser(suggestedUser))}
                className="flex bg-black  gap-3 group rounded-2xl text-white items-center p-3 hover:bg-white/95 cursor-pointer"
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
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold  w-48 truncate font-lato text-lg duration-300 transform text-white group-hover:text-black">
                    {suggestedUser?.username}
                  </span>
                  <Badge
                    className={`text-xs group-hover:hidden font-lato font-bold bg-white/10 tracking-normal ${
                      isOnline
                        ? "text-emerald-400 group-hover:text-black"
                        : "text-gray-50/50 group-hover:text-gray-950/40"
                    } `}
                  >
                    {isOnline ? "Active" : "Offline"}
                  </Badge>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default CreateChat;
