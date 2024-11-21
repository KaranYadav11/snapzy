function NotFound() {
  return (
    <div className="h-screen flex flex-col gap-2 mg:gap-8 w-full text-2xl items-center justify-center text-white font-lato">
      <div className="text-8xl select-none">📍</div>
      <div className="font-lato h-fit md:p-12 m-4  text-4xl text-white select-none font-bold">
        {" "}
        &#34;This page ran out of coffee and decided to take a break. Try again
        later!&#34;
      </div>
    </div>
  );
}

export default NotFound;
