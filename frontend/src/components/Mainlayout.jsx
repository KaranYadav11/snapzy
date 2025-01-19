import { Outlet } from "react-router-dom";
import Leftsidebar from "./Leftsidebar";
import { useLocation } from "react-router-dom";

function Mainlayout() {
  const location = useLocation();
  const isConvoPage = location.pathname.startsWith("/conversation/");

  return (
    <div className="bg-black">
      <Leftsidebar />
      <Outlet />
    </div>
  );
}

export default Mainlayout;
