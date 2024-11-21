import { Outlet } from "react-router-dom";
import Leftsidebar from "./Leftsidebar";
import LowerNav from "./LowerNav";
import { useLocation } from "react-router-dom";

function Mainlayout() {
  const location = useLocation();
  const isConvoPage = location.pathname.startsWith("/conversation/");

  return (
    <div className="bg-black">
      <Leftsidebar />
      {/* <div className="bg-gray-400"> */}
      {/* <div className="bg-purple-400 main  antialiased"> */}
      <Outlet />

      {/* </div> */}
      <div>{!isConvoPage && <LowerNav />}</div>
    </div>
  );
}

export default Mainlayout;
