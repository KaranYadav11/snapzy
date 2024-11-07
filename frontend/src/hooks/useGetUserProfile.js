import { setUserProfile } from "../redux/authSlice.js";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const useGetUserProfile = (userId) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(
          `https://snapzy.onrender.com/api/v1/user/${userId}/profile`,
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          dispatch(setUserProfile(res.data.user));
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
      }
    };
    fetchUserProfile();
  }, [dispatch, userId]);
};
export default useGetUserProfile;
