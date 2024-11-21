import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import Mainlayout from "./components/Mainlayout";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import ChatPage from "./components/ChatPage";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setSocket } from "./redux/socketSlice";
import { setOnlineUsers } from "./redux/chatSlice";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Create from "./components/Create";
import CreateChat from "./components/CreateChat";
import Convo from "./components/Convo";
import Notification from "./components/Notification";
import NotFound from "./components/NotFound";
import { pushNotification } from "./redux/notifySlice";
// import { setLikeNotification } from "./redux/rtnSlice";
const BrowserRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoutes>
        <Mainlayout />,
      </ProtectedRoutes>
    ),
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoutes>
            <Home />,
          </ProtectedRoutes>
        ),
      },
      {
        path: "/profile/:id",
        element: (
          <ProtectedRoutes>
            <Profile />,
          </ProtectedRoutes>
        ),
      },
      {
        path: "/account/edit",
        element: (
          <ProtectedRoutes>
            <EditProfile />,
          </ProtectedRoutes>
        ),
      },
      {
        path: "/chat",
        element: (
          <ProtectedRoutes>
            <ChatPage />,
          </ProtectedRoutes>
        ),
      },
      {
        path: "/createpost",
        element: (
          <ProtectedRoutes>
            <Create />,
          </ProtectedRoutes>
        ),
      },
      {
        path: "/createchat",
        element: (
          <ProtectedRoutes>
            <CreateChat />,
          </ProtectedRoutes>
        ),
      },
      {
        path: "/conversation/:id",
        element: (
          <ProtectedRoutes>
            <Convo />,
          </ProtectedRoutes>
        ),
      },
      {
        path: "/notification",
        element: (
          <ProtectedRoutes>
            <Notification />,
          </ProtectedRoutes>
        ),
      },
    ],
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  const { user } = useSelector((store) => store.auth);
  const { socket } = useSelector((store) => store.socketio);
  const dispatch = useDispatch();

  useEffect(() => {
    let socketio;
    if (user) {
      socketio = io("http://localhost:8000", {
        query: {
          userId: user?._id,
        },
        transports: ["websocket"],
      });
      dispatch(setSocket(socketio));

      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      socketio.on("notification", (notification) => {
        dispatch(pushNotification(notification));
      });

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      };
    } else if (socket) {
      socket?.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);

  return (
    <div className="bg-black ">
      <RouterProvider router={BrowserRouter} />
    </div>
  );
}

export default App;
