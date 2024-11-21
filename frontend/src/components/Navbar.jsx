import useLogout from "@/hooks/useLogout";
import { LogOut } from "lucide-react";

function Navbar() {
  const logout = useLogout();
  return (
    <div className="fixed w-screen z-50 h-14 flex items-center justify-between px-4 md:hidden top-0 bg-black/60 backdrop-blur-lg pb-2 text-lato text-white font-bold">
      <div className="bg-gradient-to-br from-purple-700 via-pink-500 to-red-400 font-pacifico font-bold flex items-center tracking-wide bg-clip-text w-1/4 h-full text-transparent text-[27px]">
        Snapzy
      </div>
      <div onClick={logout} className="">
        <LogOut size={24} />
      </div>
    </div>
  );
}

export default Navbar;
