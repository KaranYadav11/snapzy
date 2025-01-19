// import {
//   Heart,
//   House,
//   ImagePlus,
//   MessageCircle,
//   UserRound,
// } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// import { useSelector } from "react-redux";
// import { Link, useLocation } from "react-router-dom";
// import { memo } from "react";

// function LowerNav() {
//   const location = useLocation();
//   const path = location.pathname === "/notification" ? true : false;
//   const user = useSelector((store) => store.auth.user);
//   const { count } = useSelector((store) => store.notify);

//   return (
//     <div className="fixed bottom-0 bg-black h-fit w-full border-t-[3px] border-white  md:hidden  flex  justify-around p-1">
//       <Link
//         to={"/"}
//         className="text-white rounded-lg bg-black w-12 h-10 flex items-center justify-center "
//       >
//         {" "}
//         <House size={28} />
//       </Link>
//       <Link
//         to={"/createchat"}
//         className="text-white bg-black w-12 h-10 rounded-lg flex items-center justify-center "
//       >
//         <MessageCircle size={28} />
//       </Link>
//       <Link
//         to={`/createpost`}
//         className="text-white bg-black w-12 h-10 rounded-lg flex items-center justify-center "
//       >
//         {" "}
//         <ImagePlus size={28} />
//       </Link>
//       <Link
//         to={`/notification`}
//         className="text-white relative  w-12 h-10 rounded-lg flex items-center justify-center "
//       >
//         {" "}
//         <Heart size={28} />
//         {!path && count > 0 && (
//           <div
//             size="icon"
//             className={`rounded-full ${
//               count >= 0 ? "block" : "hidden"
//             } flex items-center justify-center h-[19px] w-[19px] hover:bg-rose-500 bg-rose-500 absolute bottom-5 left-6`}
//           >
//             <span className="text-[14px] font-lato font-bold">{count}</span>
//           </div>
//         )}
//       </Link>
//       <Link
//         to={`/profile/${user?._id}`}
//         className="text-white bg-black w-12 h-10 rounded-lg flex items-center justify-center "
//       >
//         {" "}
//         <Avatar className="w-8 h-8">
//           <AvatarImage src={user?.profilePicture} alt="profilePicture" />
//           <AvatarFallback className="bg-black/50">
//             {" "}
//             <UserRound size={22} color="white" />
//           </AvatarFallback>
//         </Avatar>
//       </Link>
//     </div>
//   );
// }

// export default memo(LowerNav);
