import useLogout from "@/hooks/useLogout";
import { LogOut } from "lucide-react";

function Navbar() {
  const logout = useLogout();
  return (
    <div className="fixed w-screen z-50 h-14 justify-between px-2 flex items-center md:hidden top-0 bg-black text-lato text-white pb-2 font-bold">
      <div className="bg-gradient-to-br from-purple-700 via-pink-500 to-red-400 font-pacifico font-bold flex items-center tracking-wide bg-clip-text w-1/4 h-full text-transparent text-[27px]">
        Snapzy
      </div>
      <div onClick={logout} >
        <LogOut size={24} />
      </div>
    </div>
  );
}


export default Navbar;
