import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { UserRound } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Badge } from "./ui/badge";
import LowerNav from "./LowerNav";
import { setSelectedUser } from "@/redux/authSlice";

function CreateChat() {
  const { user, suggestedUsers } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const { onlineUsers } = useSelector((store) => store.chat);
  return (
    <>
      <div>
        <section className="w-full scrollbar-hide px-2 py-2">
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
                <Link
                  to={`/conversation/${suggestedUser?._id}`}
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
                </Link>
              );
            })}
          </div>
        </section>
      </div>
      <LowerNav />
    </>
  );
}

export default CreateChat;
