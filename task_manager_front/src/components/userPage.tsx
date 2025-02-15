import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

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
};

const UserPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [userInfo, setUserInfo] = useState<userInfo>();
  const [taskList, setTaskList] = useState<taskInfo[]>([]);
  useEffect(() => {
    if (!localStorage.getItem("access_token") || localStorage.getItem("access_token") === undefined) {
      navigate("/");
    }
    if (localStorage.getItem("userId") != params.userId) {
      alert("You are not authorized to view this page");
      navigate("/");
    }
  }, [navigate]);
  useEffect(() => {
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
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/user/${localStorage.getItem("userId")}`)
      .then((response) => {
        setUserInfo(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [taskList]);

  const handleLogout = () => {
    axios
      .post("http://localhost:3000/user/logout", {},{
        headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((response) => {
        console.log(response);
        if(response.status === 200){
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Task Manager</h2>
        <button className="btn btn-danger" onClick={handleLogout}>
          Log Out
        </button>
      </div>

      {userInfo && <h2>Hello {userInfo.name}</h2>}

      <button className="btn btn-primary w-100 mb-3">Add Task</button>

      <div className="list-group">
        {taskList.length === 0 ? (
          <h3>No Tasks</h3>
        ) : (
          taskList.map((task: taskInfo, index) => (
            <div
              key={index}
              className="list-group-item d-flex justify-content-between align-items-center p-3 shadow-sm"
            >
              <div>
                <h5 className="fw-bold mb-1">{task.title}</h5>
                <p className="text-muted small mb-1">{task.description}</p>
                <small className="text-secondary">Date: {task.date}</small>
                <span
                  className={`badge ${
                    task.isComplete ? "bg-success" : "bg-warning"
                  } ms-2`}
                >
                  {task.isComplete ? "Completed" : "Pending"}
                </span>
              </div>
              <div>
                <button className="btn btn-warning btn-sm me-2">
                  Complete
                </button>
                <button className="btn btn-danger btn-sm">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserPage;
