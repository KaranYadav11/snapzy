import { Outlet } from "react-router-dom";
import Feed from "./Feed";
import Rightsidebar from "./Rightsidebar";
import useGetAllPost from "../hooks/useGetAllPost.js";
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers";

function Home() {
  useGetAllPost();
  useGetSuggestedUsers();
  return (
    <div className="flex antialiased  ">
      <div className="flex-grow">
        <Feed />
        <Outlet />
      </div>
      <Rightsidebar />
    </div>
  );
}

export default Home;
