import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { addNotification, moveTask, setUsers, upsertProject, upsertTask } from "../store/workSlice";
import { connectSocket, disconnectSocket } from "../services/socketClient";
import apiClient from "../services/apiClient";
import { appRoutes } from "../routes/config/appRoutes";

function App() {
  const token = useSelector((state) => state.auth.token);
  const theme = useSelector((state) => state.work.theme);
  const dispatch = useDispatch();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    if (!token) return undefined;
    apiClient.get("/users").then((response) => dispatch(setUsers(response.data.users))).catch(() => {});
    const socket = connectSocket(token);
    socket.on("project:created", ({ project }) => dispatch(upsertProject(project)));
    socket.on("project:updated", ({ project }) => dispatch(upsertProject(project)));
    socket.on("task:created", ({ task }) => dispatch(upsertTask(task)));
    socket.on("task:updated", ({ task }) => dispatch(upsertTask(task)));
    socket.on("task:moved", ({ taskId, status }) => dispatch(moveTask({ taskId, status })));
    socket.on("notification:created", (payload) => {
      dispatch(addNotification(payload));
      toast.info(payload.message);
    });
    return () => disconnectSocket();
  }, [dispatch, token]);

  const router = createBrowserRouter(appRoutes);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" />
    </>
  );
}

export default App;
