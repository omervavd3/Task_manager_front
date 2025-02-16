import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "./components/HomePage";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import UserPage from "./components/userPage";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="login" element={<Login />} />

      <Route path="signup" element={<SignUp />} />

      <Route path="user/:userId" element={<UserPage />} />


      <Route path="*" element={<div>Not Found</div>} />
    </Routes>
  </BrowserRouter>
);
