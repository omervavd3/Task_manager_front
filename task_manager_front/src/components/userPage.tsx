import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AddTask from "./AddTask";
import Task from "./Task";
import Auth from "./Auth";
import LoadingSpinner from "./LoadingSpinner";
import Alert from "./Alert";

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
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  const handleAlert = (message: string, type: string) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    const timer = setTimeout(() => {
      setShowAlert(false);
    }, 3000);

    return () => clearTimeout(timer);
  };

  const toggleAddTask = () => {
    setShowAddTask((prev) => !prev);
  };

  const handleRenderTasks = () => {
    handleAlert("Task added successfully", "success");
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
        handleAlert("Error loading tasks", "danger");
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
        handleAlert("Error loading user info", "danger");
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
        handleAlert("Error logging out", "danger");
      });
  };

  const handleDeleteAccount = () => {
    setLoading(true);
    axios
      .delete(`http://localhost:3000/task/deleteByUser`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          axios
            .delete(`http://localhost:3000/user/delete`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              },
            })
            .then((response) => {
              console.log(response);
              if (response.status === 200) {
                localStorage.removeItem("access_token");
                localStorage.removeItem("userId");
                navigate("/");
              }
            })
            .catch((error) => {
              console.error(error);
              handleAlert("Error deleting account", "danger");
            });
        }
      })
      .catch((error) => {
        console.error(error);
        handleAlert("Error deleting account", "danger");
      });
  };

  return (
    <div className="container mt-5">
      <Auth />
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            {showAlert && <Alert message={alertMessage} type={alertType} />}
            <h2 className="fw-bold">Task Manager</h2>
            <div>
              <button
                className="btn btn-outline-primary m-2"
                onClick={handleLogout}
              >
                Log Out
              </button>
              <button
                className="btn btn-danger m-2"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
            </div>
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
