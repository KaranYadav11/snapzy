import { useDispatch, useSelector } from "react-redux";
import { Bell, Heart, Loader2, UserRound, UserRoundPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useGetNotification from "@/hooks/useGetNotification";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { clearCount, clearNotification } from "@/redux/notifySlice";
import { toast } from "sonner";

function Notification() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const { loading } = useGetNotification();
  const { notifications } = useSelector((store) => store.notify);
  async function deleteAllNotifications() {
    try {
      if (notifications.length > 0) {
        const res = await axios.delete(
          "http://localhost:8000/api/v1/notification",
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          setIsOpen(false);
          dispatch(clearNotification());
          toast.success(res.data.message);
        }
      } else {
        toast.error("No Notifications To Delete");
      }
    } catch (err) {
      toast.error(err.response.data.message);
    }
  }
  useEffect(() => {
    return () => {
      dispatch(clearCount());
    };
  }, [dispatch]);

  return (
    <div className="md:ml-[16%] md:flex md:items-center md:justify-center">
      {loading ? (
        <div className="h-screen bg-black flex items-center justify-center">
          <Loader2 color="white" className="animate-spin w-7 h-7" />
        </div>
      ) : (
        <div className="text-white flex flex-col items-center md:mt-2 md:w-[40vw] px-2 py-2  font-lato min-h-screen w-full bg-blac">
          <div className="flex items-center rounded-2xl py-3 px-4 justify-between bg-gradient-to-br from-purple-700 via-pink-500 to-red-400 w-full ">
            <div className="font-lato py-2 text-white font-bold text-2xl">
              <span> Notifications</span>
            </div>

            <div>
              <button onClick={() => setIsOpen(true)}>
                <Bell className="w-6 mt-2 h-6" />
              </button>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild></DialogTrigger>
                <DialogContent className="bg-gradient-to-br from-purple-700 via-pink-500 to-red-400 flex flex-col items-center justify-start md:ml-[7.2%] w-[90%] md:w-[30vw] h-48 rounded-2xl">
                  <DialogTitle className="h-fit mt-3 mx-2 font-lato text-center font-bold text-white text-2xl">
                    Delete All Notifications
                  </DialogTitle>
                  <hr className=" border-white border-2 w-[97%] my-0.5" />
                  <DialogDescription className="mx-2 text-center font-lato font-normal text-white/80 text-sm h-fit">
                    Are you sure you want to delete all notifications? This
                    action cannot be undone.
                  </DialogDescription>
                  <DialogFooter>
                    <div className="flex items-center justify-center gap-10 ">
                      <Button
                        onClick={deleteAllNotifications}
                        className="bg-zinc-100 text-black  font-lato font-bold tracking-wide rounded-full px-6 py-3 hover:bg-white"
                      >
                        Delete
                      </Button>
                      <Button
                        onClick={() => setIsOpen(false)}
                        className="bg-black/50 text-white  font-lato font-bold tracking-wide rounded-full px-6 py-3 hover:bg-white"
                      >
                        Cancel
                      </Button>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <hr className=" border-white border-2  md:w-[98%] w-[97%] my-2" />
          {notifications?.length === 0 && (
            <div className="flex flex-col w-full items-center justify-center h-[70vh]">
              <Bell className="w-40 h-40 my-4 text-white/10" />
              <span className="font-lato text-white/20 text-sm tracking-wide font-normal ">
                No new notifications!
              </span>
            </div>
          )}
          {notifications?.map((notify) => (
            <div
              key={notify._id}
              className="flex w-full items-center justify-between p-2"
            >
              <div className="flex items-center gap-2">
                <Avatar className="w-11 h-11 ">
                  <AvatarImage
                    src={notify.from?.profilePicture}
                    alt="profilePicture"
                  />
                  <AvatarFallback className="bg-white/10">
                    <UserRound size={20} color="white" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex gap-4  items-center ">
                  <p className="font-lato max-w-36  truncate text-white font-bold">
                    {notify?.from?.username}
                  </p>
                  <p className="font-lato text-white/80 text-sm font-light">
                    {notify.type === "like" ? "Liked your post" : "Follows you"}
                  </p>
                </div>
              </div>
              {notify.type === "like" ? (
                <Heart fill="#f43f5e" color="#f43f5e" />
              ) : (
                <UserRoundPlus />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notification;
