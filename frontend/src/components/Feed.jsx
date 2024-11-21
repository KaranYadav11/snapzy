import Posts from "./Posts";

function Feed() {
  return (
    <div className="flex-1  mt-8 md:mt-0  md:my-6 flex flex-col items-center m-2 md:m-0 md:pl-[20%]">
      <Posts />
    </div>
  );
}

export default Feed;
