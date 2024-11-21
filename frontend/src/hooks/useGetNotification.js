import { setNotifications } from "@/redux/notifySlice.js";

import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetNotification = () => {
  const dispatch = useDispatch();
  const { hasFetched } = useSelector((store) => store.notify);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!hasFetched) {
      console.log("Fetching Notification");
      const fetchAllNotification = async () => {
        try {
          setLoading(true);
          const res = await axios.get(
            "http://localhost:8000/api/v1/notification",
            {
              withCredentials: true,
            }
          );
          if (res.data.success) {
            console.log(res.data.notification);
            dispatch(setNotifications(res.data.notification));
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };
      fetchAllNotification();
    }
  }, [dispatch]);

  return { loading };
};
export default useGetNotification;
