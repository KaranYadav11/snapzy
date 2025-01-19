import { Link } from "react-router-dom";

function NoPost() {
  return (
    <div className=" w-[90vw] max-w-sm mx-auto">
      <div className="relative rounded-2xl overflow-hidden  flex items-center justify-center aspect-square">
        <div className="flex items-center justify-center flex-col">
          <p className="text-white font-lato font-bold text-3xl">
            No posts to show.
          </p>
          <p className="text-white font-lato font-bold text-3xl">
            Follow users to get posts.
          </p>
        </div>
      </div>
      <div className="text-center">
        <Link
          to="/search"
          className="text-sm text-white font-lato font-semibold underline"
        >
          Explore Users
        </Link>
      </div>
    </div>
  );
}

export default NoPost;
