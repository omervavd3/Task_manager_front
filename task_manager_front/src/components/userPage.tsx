import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AddTask from "./AddTask";
import Task from "./Task";
import Auth from "./Auth";

type userInfo = {
  name: string;
  email: string;
  id: string;
};

type taskInfo = {
  date: string;
  title: string;
  description: string;
  isComplete: boolean;
  id: string;
};

const UserPage = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<userInfo>();
  const [taskList, setTaskList] = useState<taskInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [renderTasks, setRenderTasks] = useState(0);
  const [showAddTask, setShowAddTask] = useState(false);

  const toggleAddTask = () => {
    setShowAddTask((prev) => !prev);
  };

  const handleRenderTasks = () => {
    setRenderTasks((prev) => prev + 1);
  };

  
  useEffect(() => {
    setUserId(localStorage.getItem("userId") || "");
  }, []);
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:3000/task", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        params: {
          userId: localStorage.getItem("userId"),
        },
      })
      .then((response) => {
        setTaskList(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    setLoading(false);
  }, [renderTasks]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:3000/user/${localStorage.getItem("userId")}`)
      .then((response) => {
        setUserInfo(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    setLoading(false);
  }, []);

  const handleLogout = () => {
    axios
      .post(
        "http://localhost:3000/user/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("userId");
          navigate("/");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="container mt-5">
      <Auth />
      {loading ? (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold">Task Manager</h2>
            <button
              className="btn btn-outline-primary m-2"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>

          {userInfo && <h2>Hello {userInfo.name}</h2>}

          <button
            className="btn btn-primary w-100 mb-3"
            onClick={toggleAddTask}
          >
            {showAddTask ? "Close Add Task" : "Add Task"}
          </button>

          {showAddTask && (
            <AddTask
              userId={userId}
              renderTasks={handleRenderTasks}
              toggleShowAddTask={toggleAddTask}
            />
          )}

          <div className="list-group">
            {taskList.length === 0 ? (
              <h3>No Tasks</h3>
            ) : (
              taskList.map((task: taskInfo, index) => (
                <Task
                  key={index}
                  title={task.title}
                  description={task.description}
                  date={task.date}
                  isComplete={task.isComplete}
                  id={task.id}
                  renderTasks={handleRenderTasks}
                />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default UserPage;
