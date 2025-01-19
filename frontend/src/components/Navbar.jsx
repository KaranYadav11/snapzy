import useLogout from "@/hooks/useLogout";
import { LogOut, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const handleSearchClick = () => {
    navigate("/search");
  };

  const logout = useLogout();
  return (
    <nav className="fixed container z-50 h-14 justify-between  backdrop-blur-lg flex items-center md:hidden top-0 bg-black/60 text-lato text-white pb-2 font-bold">
      <div className="bg-gradient-to-br from-purple-700 via-pink-500 to-red-400 font-pacifico font-bold flex items-center tracking-wide bg-clip-text w-full h-full text-transparent text-[27px]">
        Snapzy
      </div>
      <div className="flex items-center  gap-8">
        <Search
          onClick={handleSearchClick}
          className="cursor-pointer"
          size={24}
        />
        <LogOut onClick={logout} className="cursor-pointer" size={24} />
      </div>
    </nav>
  );
}

export default Navbar;
