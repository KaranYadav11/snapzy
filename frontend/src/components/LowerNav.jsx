import { House, ImagePlus, MessageCircle, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function LowerNav() {
  const user = useSelector((store) => store.auth.user);

  return (
    <div className="fixed  bottom-0  bg-black h-fit w-full border-t-[3px] border-white  md:hidden  flex  justify-around p-1">
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
      <Link className="text-white bg-black w-12 h-10 rounded-lg flex items-center justify-center ">
        {" "}
        <Link to={`/profile/${user?._id}`}>
          <Avatar className="w-8 h-8">
            <AvatarImage src={user?.profilePicture} alt="profilePicture" />
            <AvatarFallback className="bg-black/50">
              {" "}
              <UserRound size={22} color="white" />
            </AvatarFallback>
          </Avatar>
        </Link>
      </Link>
    </div>
  );
}

export default LowerNav;
