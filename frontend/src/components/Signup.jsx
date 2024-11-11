import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { User, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
function Signup() {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setInput((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        `http://localhost:8000/api/v1/user/register`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setInput({
          username: "",
          email: "",
          password: "",
        });
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user) navigate("/");
  }, []);

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-black">
      <form
        onSubmit={handleSubmit}
        className="w-[90%] max-w-[380px] flex flex-col gap-6 p-8"
      >
        <div className="text-center mb-4">
          <h1 className="text-7xl antialiased transition-all duration-500 p-8 rounded-lg font-pacifico bg-gradient-to-br from-purple-700 via-pink-500 to-red-400 text-transparent bg-clip-text">
            Snapzy
          </h1>
          <p className="font-extrabold text-lg text-white mt-4 tracking-tight font-lato">
            Create a new account
          </p>
        </div>

        <div>
          <Label className="block font-lato text-white text-opacity-90 mb-1">
            <div className="flex items-center justify-start font-bold font-lato">
              <User size={18} className="mr-2 text-white " />
              Username
            </div>
          </Label>
          <Input
            type="text"
            name="username"
            value={input.username}
            onChange={handleChange}
            placeholder="Enter your username"
            className="w-full font-medium px-6 py-5  rounded-lg bg-[#121212] text-gray-50 focus-visible:ring-transparent border-none focus:outline-none   transition-all"
          />
        </div>

        <div>
          <Label className="block font-lato text-white text-opacity-90 mb-1">
            <div className="flex items-center justify-start font-bold font-lato">
              <Mail size={18} className="mr-2 text-white " />
              Email
            </div>
          </Label>
          <Input
            type="email"
            name="email"
            value={input.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full font-medium px-6 py-5  rounded-lg bg-[#121212] text-gray-50 focus-visible:ring-transparent border-none focus:outline-none   transition-all"
          />
        </div>

        <div>
          <Label className="block font-lato  text-white text-opacity-90 mb-1">
            <div className="flex items-center justify-start font-bold font-lato">
              <Lock size={18} className="mr-2 text-white " />
              Password
            </div>
          </Label>
          <Input
            type="password"
            name="password"
            value={input.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full font-medium px-6 py-5  rounded-lg bg-[#121212] text-gray-50 focus-visible:ring-transparent border-none focus:outline-none   transition-all"
          />
        </div>

        <Button
          type="submit"
          className="w-full py-5 mt-4 font-medium tracking-wide text-white bg-gradient-to-r  from-purple-500 via-pink-500 to-red-400 rounded-lg hover:opacity-90  focus-visible:ring-transparent transition-all"
        >
          {loading ? <Loader2 className="animate-spin h-6 w-6" /> : "Signup"}
        </Button>

        <p className="mt-6 text-xs text-center text-white/80 font-lato">
          Already have an account ?{" "}
          <Link to="/login">
            <span className="underline">Login Here</span>
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
