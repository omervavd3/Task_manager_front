import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import "../custom.css";
import Alert from "./Alert";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

type FormData = z.infer<typeof schema>;

const Login = () => {
  const [showAlert, setShowAlert] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("access_token") == null) {
      localStorage.setItem("access_token", "");
      localStorage.setItem("userId", "");
    }
  }, []);

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
    reset();
    console.log(data);
    axios
      .post("http://localhost:3000/user/login", data)
      .then((response) => {
        console.log(response);
        if (response.status == 200) {
          localStorage.setItem("access_token", response.data.accessToken);
          localStorage.setItem("userId", response.data.userId);
          navigate(`/user/${response.data.userId}`);
        }
      })
      .catch((error) => {
        console.error(error);
        setShowAlert(true);
        const timer = setTimeout(() => {
          setShowAlert(false);
        }, 3000);
    
        return () => clearTimeout(timer);
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      {showAlert && <Alert message="Invalid email or password" type="danger" />}
      <div className="card p-4 shadow-sm" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Log In</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            id="email"
            {...register("email")}
            type="email"
            placeholder="Enter email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
          />
          {errors.email && (
            <p className="text-danger">{errors.email.message}</p>
          )}

          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
          />
          <div className="form-check mt-2">
            <input
              type="checkbox"
              className="form-check-input"
              id="showPassword"
              checked={showPassword}
              onChange={togglePasswordVisibility}
            />
            <label className="form-check-label" htmlFor="showPassword">
              Show Password
            </label>
          </div>
          {errors.password && (
            <p className="text-danger">{errors.password.message}</p>
          )}

          <button type="submit" className="btn btn-primary w-100 mt-3">
            Log In
          </button>
        </form>

        <div className="text-center mt-3">
          <p className="text-muted">Don't have an account?</p>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
