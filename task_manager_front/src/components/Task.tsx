import { FC, useState } from "react";
import axios from "axios";

interface TaskProps {
  title: string;
  description: string;
  date: string;
  isComplete: boolean;
  id: string;
  renderTasks: () => void;
}

const Task: FC<TaskProps> = ({ title, description, date, isComplete, id, renderTasks }) => {
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
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="list-group-item d-flex justify-content-between align-items-center p-3 shadow-sm">
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
        <button className="btn btn-danger btn-sm" onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
};

export default Task;
