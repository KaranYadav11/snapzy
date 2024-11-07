import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import axios from "axios";
import {
  ImageUp,
  Loader2,
  UserRound,
  UserRoundCheck,
  UserRoundPen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { setAuthUser } from "@/redux/authSlice";

const EditProfile = () => {
  const imageRef = useRef();
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    profilePhoto: user?.profilePicture,
    bio: user?.bio,
    gender: user?.gender,
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setInput({ ...input, profilePhoto: file });
  };

  const selectChangeHandler = (value) => {
    setInput({ ...input, gender: value });
  };

  const editProfileHandler = async () => {
    console.log(input);
    const formData = new FormData();
    formData.append("bio", input.bio);
    formData.append("gender", input.gender);
    if (input.profilePhoto) {
      formData.append("profilePhoto", input.profilePhoto);
    }
    try {
      setLoading(true);
      const res = await axios.post(
        "https://snapzy.onrender.com/api/v1/user/profile/edit",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedUserData = {
          ...user,
          bio: res.data.user?.bio,
          profilePicture: res.data.user?.profilePicture,
          gender: res.data.user.gender,
        };
        dispatch(setAuthUser(updatedUserData));
        navigate(`/profile/${user?._id}`);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.messasge);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex h-screen max-w-[620px] mx-auto px-2 py-4">
      <section className="flex flex-col gap-6 w-full my-8">
        <h1 className="font-bold font-lato text-white tracking-normal flex gap-2 items-center justify-center text-xl antialiased">
          {" "}
          <UserRoundPen size={23} />
          Edit Profile
        </h1>
        <div className="flex items-center bg-gradient-to-br from-purple-700 via-pink-500 to-red-400  justify-between bg-gray-100 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.profilePicture} alt="post_image" />
              <AvatarFallback className="bg-white/10">
                {" "}
                <UserRound size={22} color="white" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-bold font-lato text-xl text-white ">
                {user?.username}
              </h1>
              <span className="text-white font-lato text-sm font-normal">
                {user?.bio || "No bio yet"}
              </span>
            </div>
          </div>
          <input
            ref={imageRef}
            onChange={fileChangeHandler}
            type="file"
            className="hidden"
          />
          <Button
            onClick={() => imageRef?.current.click()}
            className="bg-black h-8 font-lato text-white rounded-2xl font-bold transform duration-300 hover:bg-gray-100 hover:text-black"
          >
            <ImageUp /> Change Picture
          </Button>
        </div>
        <div>
          <h1 className="font-bold flex font-lato justify-center text-white text-xl mb-2">
            Bio
          </h1>
          <Textarea
            style={{
              boxShadow: "none",
              border: "none",
            }}
            spellCheck="false"
            value={input.bio}
            onChange={(e) => setInput({ ...input, bio: e.target.value })}
            name="bio"
            className="focus-visible:ring-transparent bg-gray-200 font-lato font-medium text-black"
          />
        </div>
        <div>
          <h1 className="font-bold flex justify-center text-white text-xl mb-2">
            Gender
          </h1>
          <Select
            className="bg-transparent border-none focus-visible:ring-transparent font-lato font-medium text-black"
            defaultValue={input.gender}
            onValueChange={selectChangeHandler}
          >
            <SelectTrigger className="w-full border-none outline-none bg-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black border-none outline-none">
              <SelectGroup>
                <SelectItem
                  className="font-normal fony-lato text-white bg-black"
                  value="male"
                >
                  Male
                </SelectItem>
                <SelectItem
                  className="font-normal fony-lato text-white bg-black"
                  value="female"
                >
                  Female
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex mt-28 justify-center">
          {loading ? (
            <Button className="bg-white h-8 w-32 font-lato text-black rounded-2xl font-bold transform duration-300 hover:bg-gray-200 hover:text-black">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            </Button>
          ) : (
            <Button
              onClick={editProfileHandler}
              className="bg-white h-8 w-32 font-lato text-black rounded-2xl font-bold transform duration-300 hover:bg-gray-200 hover:text-black"
            >
              <UserRoundCheck />
              Submit
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
