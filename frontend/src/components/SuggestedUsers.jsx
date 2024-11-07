import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { UserRound, UsersRound } from "lucide-react";

function SuggestedUsers() {
  const { suggestedUsers } = useSelector((store) => store.auth);
  return (
    <div className="flex  mt-10 h-auto flex-col w-[320px]  items-center ">
      <div className="flex items-center justify-between text-white font-lato">
        <div className="font-bold gap-2 flex items-center mb-4 tracking-normal font-lato text-xl text-white ">
          <UsersRound size={22} />
          <h1>Suggested Users</h1>
        </div>
      </div>
      <div className="bg-black w-full flex flex-col gap-y-0 font-lato">
        {suggestedUsers?.map((user) => {
          return (
            <div
              key={user?._id}
              className="flex gap-2 rounded-2xl bg-black border- opacity-95 px-4 py-3 items-center"
            >
              <Avatar className="w-14 h-14">
                <AvatarImage src={user?.profilePicture} alt="profilePicture" />
                <AvatarFallback className="bg-white/10">
                  {" "}
                  <UserRound size={20} color="white" />
                </AvatarFallback>
              </Avatar>
              <div className="relative ">
                <p className="font-lato  w-56 truncate absolute tracking-wide -top-[25px] text-white text-lg font-bold">
                  <Link to={`/profile/${user?._id}`}> {user?.username}</Link>
                </p>
                <p className="font-lato absolute h-5 overflow-hidden w-56  -top-[0px] tracking-normal text-white/90 font-medium antialiased text-xs truncate">
                  {user?.bio}
                </p>
              </div>
              <div className="text-white bg-black right-5 py-1 tracking-normal  font-bold text-sm  px-3 rounded-full absolute cursor-pointer font-lato">
                Follow
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SuggestedUsers;
