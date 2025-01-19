import { useSelector } from "react-redux";
import { Bell, Loader2, Search, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "./ui/input";

function SearchPage() {
  const user = useSelector((store) => store.auth.user);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  useEffect(() => {
    getAllUsers();
  }, []);

  const getAllUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://snapzy.onrender.com/api/v1/user/all",
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedUsers = res.data.users.filter(
          (u) => u._id.toString() !== user._id.toString()
        );
        setAllUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
      } else {
        toast.error("No Users Found");
      }
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const changeEventHandler = (e) => {
    setSearch(e.target.value);
  };

  const searchUsers = () => {
    if (search.trim() === "") {
      setFilteredUsers(allUsers);
    } else {
      const filtered = allUsers.filter((user) =>
        user.username.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div className="md:ml-[16%] md:flex md:items-center md:justify-center">
      {loading ? (
        <div className="h-screen bg-black flex items-center justify-center">
          <Loader2 color="white" className="animate-spin w-7 h-7" />
        </div>
      ) : (
        <div className="text-white flex top-2 flex-col items-center px-2 py-2 md:mt-2 md:w-[40vw] font-lato min-h-screen container">
          <div className="flex items-center rounded-2xl py-3 px-4 justify-between bg-gradient-to-br from-purple-700 via-pink-500 to-red-400 w-full">
            <div className="font-lato py-2 text-white font-bold text-2xl">
              <span>Search</span>
            </div>

            <div>
              <button onClick={() => setIsOpen(true)}>
                <Search className="w-6 mt-2 h-6" />
              </button>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild></DialogTrigger>
                <DialogContent className="bg-gradient-to-br md:rounded-2xl from-purple-700 via-pink-500 to-red-400 flex flex-col items-center justify-start md:ml-[7.2%] w-[90%] md:w-[30vw] h-48 rounded-2xl">
                  <DialogTitle className="h-fit mt-3 mx-2 font-lato text-center font-bold text-white text-2xl">
                    Search
                  </DialogTitle>
                  <hr className="border-white border-2 w-[97%] my-0.5" />
                  <Input
                    type="text"
                    value={search}
                    onChange={changeEventHandler}
                    spellCheck="false"
                    placeholder="Type Username"
                    className="outline-none underline-none placeholder:text-white/80 placeholder:font-lato placeholder:font-medium focus:outline-none focus:ring-0 text-sm w-full text-white font-bold font-lato placeholder:tracking-wider bg-transparent border-none"
                    style={{
                      boxShadow: "none",
                      border: "none",
                    }}
                  />
                  <DialogFooter>
                    <div className="flex items-center justify-center gap-10">
                      <Button
                        onClick={searchUsers}
                        className="bg-zinc-100 text-black font-lato font-bold tracking-wide rounded-full px-6 py-3 hover:bg-white"
                      >
                        Submit
                      </Button>
                      <Button
                        onClick={() => setIsOpen(false)}
                        className="bg-black/50 text-white font-lato font-bold tracking-wide rounded-full px-6 py-3 hover:bg-white"
                      >
                        Cancel
                      </Button>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <hr className="border-white border-2 md:w-[98%] w-[97%] my-2" />
          {filteredUsers.length === 0 ? (
            <div className="flex flex-col w-full items-center justify-center h-[70vh]">
              <Bell className="w-40 h-40 my-4 text-white/10" />
              <span className="font-lato text-white/20 text-sm tracking-wide font-normal">
                No Users Found
              </span>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <Link
                key={user._id}
                to={`/profile/${user?._id}`}
                className="flex gap-2 mb-2 rounded-2xl bg-gradient-to-br from-purple-700 via-pink-500 to-red-400 w-full px-4 py-3 items-center"
              >
                <Avatar className="w-14 h-14">
                  <AvatarImage
                    src={user?.profilePicture}
                    alt="profilePicture"
                  />
                  <AvatarFallback className="bg-white/10">
                    <UserRound size={22} color="white" />
                  </AvatarFallback>
                </Avatar>

                <div className="relative">
                  <p className="font-lato w-36 truncate absolute tracking-wide -top-[25px] text-white text-lg font-bold">
                    <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
                  </p>
                  <p className="font-lato absolute h-5 overflow-hidden w-56 -top-[0px] tracking-normal text-white/90 font-medium antialiased text-xs truncate">
                    {user?.bio}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default SearchPage;
