import { useNavigate } from "react-router";
import "../custom.css";
import { useEffect } from "react";
import axios from "axios";

const HomePage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      axios
        .get("http://localhost:3000/auth", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
        .then((response) => {
          console.log(response);
          if (response.status === 200 && response.data.id) {
            navigate("/user/" + response.data.id);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center ">
      <div className="container text-center">
        <div className="row p-2">
          <div className="col-md-12">
            <h1 className="text-center">Task Manager</h1>
          </div>
        </div>
        <div className="row p-2">
          <div className="col-md-12">
            <h2 className="text-center">Welcome to Task Manager</h2>
          </div>
        </div>
        <div className="row p-2">
          <div className="col-md-12">
            <button
              type="button"
              className="btn btn-outline-primary m-2"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
            <button
              type="button"
              className="btn btn-outline-primary m-2"
              onClick={() => navigate("/login")}
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
