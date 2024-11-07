// import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers";
import { UserRound } from "lucide-react";
import { Badge } from "./ui/badge";
// import SuggestedUsers from "./SuggestedUsers";

const RightSidebar = () => {
  const { user } = useSelector((store) => store.auth);
  return (
    <div className="w-[350px]  my-12 px-4">
      <div className="sticky top-4">
        <div>
          <Link
            to={`/profile/${user?._id}`}
            className="flex gap-2 rounded-2xl bg-gradient-to-br from-purple-700 via-pink-500 to-red-400  px-4 py-3 items-center"
          >
            <Avatar className="w-14 h-14">
              <AvatarImage src={user?.profilePicture} alt="profilePicture" />
              <AvatarFallback className="bg-black/50">
                {" "}
                <UserRound size={22} color="white" />
              </AvatarFallback>
            </Avatar>
            <div className="relative">
              <p className="font-lato  w-36  truncate absolute tracking-wide -top-[25px] text-white text-lg font-bold">
                {user?.username}
              </p>
              <Badge className="absolute text-white bg-black/70 font-lato font-bold -top-[22px] left-[158px]">
                Active
              </Badge>
              <p className="font-lato absolute h-5 overflow-hidden w-56  -top-[0px] tracking-normal text-white/90 font-medium antialiased text-xs truncate">
                {user?.bio}
              </p>
            </div>
          </Link>
        </div>
        <SuggestedUsers />
      </div>
    </div>
  );
};

export default RightSidebar;
