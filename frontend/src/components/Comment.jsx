import { UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

function Comment({ comment }) {
  return (
    <div>
      <div className="flex justify-start gap-2 items-center">
        <Avatar>
          <AvatarImage src={comment?.author?.profilePicture} />
          <AvatarFallback className="bg-white/10">
            <UserRound size={22} color="white" />
          </AvatarFallback>
        </Avatar>
        <div className="flex items-center gap-2">
          <h1 className=" mr-1 font-lato text-white font-bold text-sm">
            {comment?.author.username}
          </h1>
          <div className=" bg-black/70 px-2 py-1 rounded-lg  ">
            <p className="font-lato font-medium text-sm">{comment?.text}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Comment;
