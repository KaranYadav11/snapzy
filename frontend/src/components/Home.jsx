import { Outlet } from "react-router-dom";
import Feed from "./Feed";
import Rightsidebar from "./Rightsidebar";
import useGetAllPost from "../hooks/useGetAllPost.js";
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers";
import Navbar from "./Navbar";
import { Loader2 } from "lucide-react";

function Home() {
  const { loading } = useGetAllPost();
  useGetSuggestedUsers();

  return (
    <div className="flex antialiased  ">
      <div className="flex-grow">
        <Navbar />
        {loading ? (
          <div className="w-full mt-8 md:mt-0 md:my-6 flex m-2 md:m-0 md:pl-[20%] bg-black justify-center items-center h-screen">
            <div>
              <Loader2 color="white" className="animate-spin h-7 w-7" />
            </div>{" "}
          </div>
        ) : (
          <>
            <Feed />
            <Outlet />
          </>
        )}
      </div>
      <Rightsidebar />
    </div>
  );
}

export default Home;
