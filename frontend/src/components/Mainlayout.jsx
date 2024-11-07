import { Outlet } from "react-router-dom";
import Leftsidebar from "./Leftsidebar";

function Mainlayout() {
  return (
    <div>
      <Leftsidebar />
      {/* <div className="bg-gray-400"> */}
      <div className="bg-black antialiased">
        <Outlet />
      </div>
    </div>
  );
}

export default Mainlayout;
