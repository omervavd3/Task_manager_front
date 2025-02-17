import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import "../custom.css";
import Alert from "./Alert";

const schema = z.object({
  email: z.string().email("Invalid email"),
  name: z.string().min(3, "Name must be at least 3 characters long"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

type FormData = z.infer<typeof schema>;

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (formData: FormData) => {
    reset();
    axios
      .post("http://localhost:3000/user/register", formData)
      .then((response) => {
        console.log(response);
        if (response.status == 201) {
          navigate("/login");
        } else {
          console.log("failed");
          alert("User name or email already exists");
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
      {showAlert && (<Alert message="User name or email already exists" type="danger"/>)}
      <div className="card p-4 shadow-sm" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Sign Up</h2>
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
            autoComplete="off"
          />
          {errors.email && (
            <p className="text-danger">{errors.email.message}</p>
          )}

          <label htmlFor="name" className="form-label">
            User Name
          </label>
          <input
            id="name"
            {...register("name")}
            type="text"
            placeholder="Enter name"
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
            autoComplete="off"
          />
          {errors.name && <p className="text-danger">{errors.name.message}</p>}

          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            autoComplete="off"
          />
          {errors.password && (
            <p className="text-danger">{errors.password.message}</p>
          )}

          <div className="form-check mt-2">
            <input
              type="checkbox"
              className="form-check-input"
              id="showPassword"
              checked={showPassword}
              onChange={() => setShowPassword((prev) => !prev)}
            />
            <label className="form-check-label" htmlFor="showPassword">
              Show Password
            </label>
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-3">
            Sign Up
          </button>
        </form>

        <div className="text-center mt-3">
          <p className="text-muted">Already have an account?</p>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={() => navigate("/login")}
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
