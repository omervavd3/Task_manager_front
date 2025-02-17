import { FC, useState } from "react";
import axios from "axios";
import Alert from "./Alert";

interface TaskProps {
  title: string;
  description: string;
  date: string;
  isComplete: boolean;
  id: string;
  renderTasks: () => void;
}

const Task: FC<TaskProps> = ({
  title,
  description,
  date,
  isComplete,
  id,
  renderTasks,
}) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [complete, setComplete] = useState(isComplete);
  const handleComplete = () => {
    axios
      .patch(
        `http://localhost:3000/task/${id}`,
        { isComplete: !complete },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        setComplete(!complete);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDelete = () => {
    axios
      .delete(`http://localhost:3000/task/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((response) => {
        console.log(response);
        renderTasks();
        setAlertMessage("Task deleted successfully");
        setAlertType("info");
      })
      .catch((error) => {
        console.error(error);
        setAlertMessage("Error deleting task");
        setAlertType("danger");
      });

    setShowAlert(true);
    const timer = setTimeout(() => {
      setShowAlert(false);
    }, 3000);

    return () => clearTimeout(timer);
  };

  return (
    <div className="list-group-item d-flex justify-content-between align-items-center p-3 shadow-sm">
        {showAlert && <Alert message={alertMessage} type={alertType} />}
      <div>
        <h5 className="fw-bold mb-1">{title}</h5>
        <p className="text-muted small mb-1">{description}</p>
        <small className="text-secondary">Due Date: {date}</small>
        <span
          className={`badge ${complete ? "bg-success" : "bg-warning"} ms-2`}
        >
          {complete ? "Completed" : "Pending"}
        </span>
      </div>
      <div>
        {complete ? (
          <button
            className="btn btn-warning btn-sm me-2"
            onClick={handleComplete}
          >
            Not Complete
          </button>
        ) : (
          <button
            className="btn btn-warning btn-sm me-2"
            onClick={handleComplete}
          >
            Complete
          </button>
        )}
        <button className="btn btn-danger btn-sm" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default Task;
