import { setPosts } from "../redux/postSlice.js";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllPost = () => {
  const { posts } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchAllPost = async () => {
      try {
        const res = await axios.get(
          "https://snapzy.onrender.com/api/v1/post/all",
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          console.log(res.data, "all posts");
          if (posts.length !== res.data.allPosts.length)
            dispatch(setPosts(res.data.allPosts));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllPost();
  }, [posts.length, dispatch]);

  return { loading };
};
export default useGetAllPost;
