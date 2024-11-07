import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  AtSign,
  Bookmark,
  Heart,
  Images,
  MessageCircle,
  UserRound,
  UserRoundPen,
} from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { setAuthUser, setUserProfile } from "@/redux/authSlice";
import { toast } from "sonner";

const Profile = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const userId = params.id;
  useGetUserProfile(userId);
  const [activeTab, setActiveTab] = useState("posts");

  const { userProfile, user } = useSelector((store) => store.auth);

  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const isFollowing = userProfile?.followers.includes(user?._id);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const displayedPost =
    activeTab === "posts" ? userProfile?.post : userProfile?.bookmarks;

  const handleFollowOrUnfollow = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/user/followorunfollow/${userProfile._id}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        console.log(res.data);
        if (user.following.includes(userProfile._id)) {
          const userUpdatedFollowing = user.following.filter(
            (id) => id !== userProfile._id
          );
          const userProfileUpdatedFollowers = userProfile.followers.filter(
            (id) => id !== user._id
          );
          dispatch(setAuthUser({ ...user, following: userUpdatedFollowing }));
          dispatch(
            setUserProfile({
              ...userProfile,
              followers: userProfileUpdatedFollowers,
            })
          );
          toast.success(res.data.message);
        } else {
          const updatedUser = [...user.following, userProfile._id];
          const updatedUserProfile = [...userProfile.followers, user._id];
          dispatch(setAuthUser({ ...user, following: updatedUser }));
          dispatch(
            setUserProfile({
              ...userProfile,
              followers: updatedUserProfile,
            })
          );
          toast.success(res.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div
      className={`flex min-h-screen max-w-5xl justify-center mx-auto pl-[2%] ${
        activeTab === "saved" ? "h-full" : ""
      }`}
    >
      <div className="flex flex-col gap-20 p-8">
        <div className="grid grid-cols-2">
          <section className="flex items-center justify-center">
            <Avatar className="h-36 w-36">
              <AvatarImage
                src={userProfile?.profilePicture}
                alt="profilephoto"
              />
              <AvatarFallback className="bg-white/10">
                {" "}
                <UserRound size={36} color="white" />
              </AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className="flex flex-col gap-5">
              <div className="flex justify-evenly items-center gap-2 px-2">
                <span className="font-lato font-bold text-white">
                  {userProfile?.username}
                </span>
                {isLoggedInUserProfile ? (
                  <>
                    <Link to="/account/edit">
                      <Button
                        variant="ghost"
                        className="bg-gray-100 text-black  h-8 my-2 outline-none hover:bg-black border-[3px]   hover:text-white transform duration-300 border-white font-lato font-normal px-3 text-sm rounded-3xl"
                      >
                        <UserRoundPen /> Edit
                      </Button>
                    </Link>
                  </>
                ) : isFollowing ? (
                  <>
                    <Button
                      onClick={handleFollowOrUnfollow}
                      className="bg-gradient-to-br from-zinc-200 via-white to-zinc-200  h-8 px-3  w-24 text-sm rounded-3xl hover:opacity-80 duration-300 transform my-2 text-black"
                    >
                      Unfollow
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={handleFollowOrUnfollow}
                    className="bg-gradient-to-br  from-zinc-200 via-white to-zinc-200 h-8 px-3  w-24 text-sm rounded-3xl my-2 hover:opacity-80 transform duration-300 text-black"
                  >
                    Follow
                  </Button>
                )}
              </div>
              <div className="flex items-center font-lato font-normal text-white gap-4">
                <p>
                  <span className="font-lato font-bold text-white">
                    {userProfile?.post?.length}{" "}
                  </span>
                  <span className="font-lato font-normal text-white">
                    Posts
                  </span>
                </p>
                <p>
                  <span className="font-lato font-bold text-white">
                    {userProfile?.followers?.length}{" "}
                  </span>
                  <span className="font-lato font-normal text-white">
                    Followers
                  </span>
                </p>
                <p>
                  <span className="font-lato font-bold text-white">
                    {userProfile?.following?.length}{" "}
                  </span>
                  <span className="font-lato font-normal text-white">
                    Following
                  </span>
                </p>
              </div>
              <div className="flex items-start flex-col gap-2">
                <span className="font-lato font-normal text-white truncate w-56">
                  {userProfile?.bio || "No bio yet "}
                </span>
                <Badge
                  className="w-fit px-4 border-none outline-none py-1.5 bg-gradient-to-br from-purple-700 via-pink-500 to-red-400 truncate font-lato font-bold text-sm text-black"
                  variant="secondary"
                >
                  <AtSign size={18} />{" "}
                  <span className="pl-1">{userProfile?.username}</span>{" "}
                </Badge>
              </div>
            </div>
          </section>
        </div>
        <div className="border-t-2 max-w-[480px] border-t-gray-100 ">
          <div className="flex my-4 items-center justify-center gap-10 text-sm">
            <div
              className={`py-2 flex items-center gap-0.5 border-none transform duration-300 border-white rounded-full px-4 cursor-pointer font-lato font-bold  ${
                activeTab === "posts" ? "text-black bg-gray-100" : "text-white"
              }`}
              onClick={() => handleTabChange("posts")}
            >
              <Images size={20} />
              POSTS
            </div>
            <div
              className={`py-2 flex gap-0.5  items-center border-none transform duration-300 border-white rounded-full px-4 cursor-pointer font-lato font-bold ${
                activeTab === "saved" ? "text-black bg-gray-100" : "text-white"
              }`}
              onClick={() => handleTabChange("saved")}
            >
              <Bookmark fill="white" size={20} />
              SAVED
            </div>
          </div>
          <div className="grid bg-black grid-cols-2 gap-1">
            {displayedPost?.map((post) => {
              return (
                <div key={post?._id} className="relative group cursor-pointer">
                  <img
                    src={post?.image}
                    alt="postimage"
                    className="rounded-lg my-0 w-full aspect-square object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity hover:rounded-lg rounded-lg duration-300">
                    <div className="flex items-center text-white space-x-4">
                      <button className="flex items-center gap-2 hover:text-gray-300">
                        <Heart />
                        <span>{post?.likes?.length}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-gray-300">
                        <MessageCircle />
                        <span>{post?.comments?.length}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
