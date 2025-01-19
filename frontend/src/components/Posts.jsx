import { useSelector } from "react-redux";
import Post from "./Post";
import NoPost from "./NoPost";

function Posts() {
  const { posts } = useSelector((store) => store.post);

  return (
    <div>
      {posts.length === 0 ? (
        <NoPost />
      ) : (
        posts.map((post) => {
          return <Post key={post._id} post={post} />;
        })
      )}
    </div>
  );
}

export default Posts;
